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

declare global {
  // eslint-disable-next-line no-var
  var __rateLimitStore: Map<string, Entry> | undefined;
}

const store = global.__rateLimitStore ?? new Map<string, Entry>();
if (!global.__rateLimitStore) {
  global.__rateLimitStore = store;
}

export const checkRateLimit = (
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
