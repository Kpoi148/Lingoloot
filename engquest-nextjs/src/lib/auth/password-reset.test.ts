import {
  PASSWORD_RESET_TOKEN_TTL_MINUTES,
  createPasswordResetToken,
  hashPasswordResetToken,
  isPasswordResetTokenFormat,
  resolveAppBaseUrl,
} from "./password-reset";

describe("password reset utilities", () => {
  it("creates a token with the expected 15-minute ttl", () => {
    const now = new Date("2026-02-21T10:00:00.000Z");
    const result = createPasswordResetToken(now);

    expect(result.token).toHaveLength(64);
    expect(isPasswordResetTokenFormat(result.token)).toBe(true);
    expect(result.tokenHash).toBe(hashPasswordResetToken(result.token));
    expect(result.expiresAt.getTime() - now.getTime()).toBe(
      PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000
    );
    expect(PASSWORD_RESET_TOKEN_TTL_MINUTES).toBe(15);
  });

  it("rejects invalid token formats", () => {
    expect(isPasswordResetTokenFormat("")).toBe(false);
    expect(isPasswordResetTokenFormat("abc")).toBe(false);
    expect(isPasswordResetTokenFormat("z".repeat(64))).toBe(false);
  });

  it("uses NEXTAUTH_URL when available", () => {
    const previous = process.env.NEXTAUTH_URL;
    process.env.NEXTAUTH_URL = "https://lingoloot.example.com/";

    try {
      expect(
        resolveAppBaseUrl("http://localhost:3000/api/auth/forgot-password")
      ).toBe("https://lingoloot.example.com");
    } finally {
      if (typeof previous === "string") {
        process.env.NEXTAUTH_URL = previous;
      } else {
        delete process.env.NEXTAUTH_URL;
      }
    }
  });
});
