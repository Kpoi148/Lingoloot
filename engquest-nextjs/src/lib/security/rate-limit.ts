// Shared rate limiting helper for abuse-prone public and admin APIs.
type Entry = {
  count: number;
  resetAt: number;
};

type CheckRateLimitOptions = {
  max: number;
  windowMs: number;
};

type CheckRateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const RATE_LIMIT_PREFIX = "lingoloot:rate-limit";

type UpstashPipelineResult = {
  result?: Array<{ result?: unknown; error?: string }>;
  error?: string;
};

declare global {
  var __rateLimitStore: Map<string, Entry> | undefined;
  var __rateLimitWarned: boolean | undefined;
}

const store = global.__rateLimitStore ?? new Map<string, Entry>();
if (!global.__rateLimitStore) {
  global.__rateLimitStore = store;
}

const checkMemoryRateLimit = (
  key: string,
  { max, windowMs }: CheckRateLimitOptions
): CheckRateLimitResult => {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= max) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000)
      ),
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return { allowed: true, retryAfterSeconds: 0 };
};

const parseNumericResult = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
};

const getUpstashConfig = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV === "production" && !global.__rateLimitWarned) {
      global.__rateLimitWarned = true;
      console.warn(
        "[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN missing in production. Falling back to in-memory rate limit."
      );
    }
    return null;
  }

  return { url, token };
};

const checkUpstashRateLimit = async (
  key: string,
  { max, windowMs }: CheckRateLimitOptions
): Promise<CheckRateLimitResult | null> => {
  const config = getUpstashConfig();
  if (!config) {
    return null;
  }

  const redisKey = `${RATE_LIMIT_PREFIX}:${key}`;

  try {
    const response = await fetch(`${config.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["PEXPIRE", redisKey, windowMs, "NX"],
        ["PTTL", redisKey],
      ]),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Upstash request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as UpstashPipelineResult;
    const countValue = payload.result?.[0]?.result;
    const ttlValue = payload.result?.[2]?.result;
    const count = parseNumericResult(countValue);
    const ttlMs = parseNumericResult(ttlValue);

    if (count === null) {
      throw new Error("Invalid INCR result from Upstash.");
    }

    if (count > max) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil(((ttlMs ?? windowMs) > 0 ? (ttlMs ?? windowMs) : windowMs) / 1000)
        ),
      };
    }

    return { allowed: true, retryAfterSeconds: 0 };
  } catch (error) {
    if (!global.__rateLimitWarned) {
      global.__rateLimitWarned = true;
      console.warn(
        "[rate-limit] Upstash rate limit failed. Falling back to in-memory store.",
        error
      );
    }
    return null;
  }
};

export const checkRateLimit = async (
  key: string,
  options: CheckRateLimitOptions
): Promise<CheckRateLimitResult> => {
  const distributedResult = await checkUpstashRateLimit(key, options);
  if (distributedResult) {
    return distributedResult;
  }

  return checkMemoryRateLimit(key, options);
};
