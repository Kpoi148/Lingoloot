// Password reset helper for issuing, validating, and consuming reset tokens.
import { createHash, randomBytes } from "crypto";

export const PASSWORD_RESET_TOKEN_TTL_MINUTES = 15;
export const PASSWORD_RESET_TOKEN_BYTES = 32;
const PASSWORD_RESET_TOKEN_REGEX = /^[a-f0-9]{64}$/;

export const hashPasswordResetToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export const isPasswordResetTokenFormat = (token: string) =>
  PASSWORD_RESET_TOKEN_REGEX.test(token);

export const createPasswordResetToken = (now: Date = new Date()) => {
  const token = randomBytes(PASSWORD_RESET_TOKEN_BYTES).toString("hex");
  const tokenHash = hashPasswordResetToken(token);
  const expiresAt = new Date(
    now.getTime() + PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000
  );

  return { token, tokenHash, expiresAt };
};

const trimTrailingSlashes = (value: string) => value.replace(/\/+$/, "");

export const resolveAppBaseUrl = (requestUrl: string) => {
  const configuredBaseUrl =
    process.env.NEXTAUTH_URL?.trim() || process.env.APP_BASE_URL?.trim();
  if (configuredBaseUrl) {
    return trimTrailingSlashes(configuredBaseUrl);
  }

  const parsedRequestUrl = new URL(requestUrl);
  return `${parsedRequestUrl.protocol}//${parsedRequestUrl.host}`;
};

export const buildPasswordResetUrl = (token: string, requestUrl: string) => {
  const resetUrl = new URL("/reset-password", resolveAppBaseUrl(requestUrl));
  resetUrl.searchParams.set("token", token);
  return resetUrl.toString();
};
