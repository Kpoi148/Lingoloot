// Helpers for minting and verifying proof tokens before progress is persisted.
import { SignJWT, jwtVerify } from "jose";

export type ProgressProofKind = "vocab" | "quiz";

type CreateProgressProofInput = {
  userId: string;
  categoryId: string;
  kind: ProgressProofKind;
  ttlSeconds?: number;
};

type VerifyProgressProofInput = {
  token: string;
  userId: string;
  categoryId: string;
  kind: ProgressProofKind;
};

type VerifyProgressProofResult = {
  valid: boolean;
  reason?: string;
};

const PROGRESS_PROOF_ISSUER = "lingoloot-progress";
const PROGRESS_PROOF_AUDIENCE = "lingoloot-client";
const DEFAULT_PROOF_TTL_SECONDS = 15 * 60;

const toSecretKey = () => {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
};

export async function createProgressProof({
  userId,
  categoryId,
  kind,
  ttlSeconds = DEFAULT_PROOF_TTL_SECONDS,
}: CreateProgressProofInput) {
  const key = toSecretKey();
  if (!key) return null;

  const normalizedUserId = userId.trim();
  const normalizedCategoryId = categoryId.trim();
  if (!normalizedUserId || !normalizedCategoryId) return null;

  return new SignJWT({
    uid: normalizedUserId,
    cid: normalizedCategoryId,
    kind,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(PROGRESS_PROOF_ISSUER)
    .setAudience(PROGRESS_PROOF_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(key);
}

export async function verifyProgressProof({
  token,
  userId,
  categoryId,
  kind,
}: VerifyProgressProofInput): Promise<VerifyProgressProofResult> {
  const key = toSecretKey();
  if (!key) {
    return { valid: false, reason: "proof-secret-missing" };
  }

  try {
    const { payload } = await jwtVerify(token, key, {
      issuer: PROGRESS_PROOF_ISSUER,
      audience: PROGRESS_PROOF_AUDIENCE,
    });

    if (payload.uid !== userId) {
      return { valid: false, reason: "proof-user-mismatch" };
    }
    if (payload.cid !== categoryId) {
      return { valid: false, reason: "proof-category-mismatch" };
    }
    if (payload.kind !== kind) {
      return { valid: false, reason: "proof-kind-mismatch" };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: "proof-invalid" };
  }
}

