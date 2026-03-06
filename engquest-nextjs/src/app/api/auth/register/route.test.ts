/** @jest-environment node */

import { POST } from "./route";
import { checkRateLimit } from "@/lib/security/rate-limit";

jest.mock("@/lib/security/rate-limit", () => ({
  checkRateLimit: jest.fn(),
}));

const mockedCheckRateLimit =
  checkRateLimit as jest.MockedFunction<typeof checkRateLimit>;

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns 429 when rate limit is exceeded", async () => {
    mockedCheckRateLimit.mockResolvedValue({
      allowed: false,
      retryAfterSeconds: 12,
    });

    const response = await POST(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = (await response.json()) as { message: string };

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("12");
    expect(payload.message).toBe("Too many requests. Please try again later.");
  });
});
