/** @jest-environment node */

import { POST } from "./route";
import { requireUserApiSession } from "@/lib/auth/api-auth";
import { checkRateLimit } from "@/lib/security/rate-limit";

jest.mock("@/lib/auth/api-auth", () => ({
  requireUserApiSession: jest.fn(),
}));

jest.mock("@/lib/security/rate-limit", () => ({
  checkRateLimit: jest.fn(),
}));

const mockedRequireUserApiSession =
  requireUserApiSession as jest.MockedFunction<typeof requireUserApiSession>;
const mockedCheckRateLimit =
  checkRateLimit as jest.MockedFunction<typeof checkRateLimit>;

describe("POST /api/cloudinary/signature", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedCheckRateLimit.mockResolvedValue({
      allowed: true,
      retryAfterSeconds: 0,
    });
    process.env.CLOUDINARY_CLOUD_NAME = "demo";
    process.env.CLOUDINARY_API_KEY = "key";
    process.env.CLOUDINARY_API_SECRET = "secret";
    process.env.CLOUDINARY_UPLOAD_BASE_FOLDER = "lingoloot";
  });

  it("returns 401 for anonymous requests", async () => {
    mockedRequireUserApiSession.mockResolvedValue({
      ok: false,
      status: 401,
      message: "Unauthorized.",
    });

    const response = await POST(
      new Request("http://localhost/api/cloudinary/signature", {
        method: "POST",
        body: JSON.stringify({ folder: "lingoloot/vocab" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    expect(response.status).toBe(401);
    expect(mockedCheckRateLimit).not.toHaveBeenCalled();
  });

  it("scopes non-admin uploads to user-safe folder", async () => {
    mockedRequireUserApiSession.mockResolvedValue({
      ok: true,
      session: {
        user: { id: "user-1", role: "user" },
        expires: "2099-01-01T00:00:00.000Z",
      },
    });

    const response = await POST(
      new Request("http://localhost/api/cloudinary/signature", {
        method: "POST",
        body: JSON.stringify({ folder: "lingoloot/vocab" }),
        headers: { "Content-Type": "application/json" },
      })
    );
    const payload = (await response.json()) as { folder?: string };

    expect(response.status).toBe(200);
    expect(payload.folder).toBe("lingoloot/users/user-1/vocab");
  });

  it("returns 429 when rate limit is exceeded", async () => {
    mockedRequireUserApiSession.mockResolvedValue({
      ok: true,
      session: {
        user: { id: "user-1", role: "admin" },
        expires: "2099-01-01T00:00:00.000Z",
      },
    });
    mockedCheckRateLimit.mockResolvedValue({
      allowed: false,
      retryAfterSeconds: 18,
    });

    const response = await POST(
      new Request("http://localhost/api/cloudinary/signature", {
        method: "POST",
        body: JSON.stringify({ folder: "lingoloot/vocab" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("18");
  });
});
