/** @jest-environment node */

import { POST } from "./route";
import { requireAdminApiSession } from "@/lib/api-auth";
import { checkRateLimit } from "@/lib/rate-limit";

jest.mock("@/lib/api-auth", () => ({
  requireAdminApiSession: jest.fn(),
}));

jest.mock("@/lib/rate-limit", () => ({
  checkRateLimit: jest.fn(),
}));

const mockGenerateContent = jest.fn();

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: () => ({
      generateContent: mockGenerateContent,
    }),
  })),
}));

const mockedRequireAdminApiSession =
  requireAdminApiSession as jest.MockedFunction<typeof requireAdminApiSession>;
const mockedCheckRateLimit =
  checkRateLimit as jest.MockedFunction<typeof checkRateLimit>;

describe("POST /api/ai/generate", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    process.env.GEMINI_API_KEY = "test-key";
    mockedCheckRateLimit.mockResolvedValue({
      allowed: true,
      retryAfterSeconds: 0,
    });
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({ questions: [] }),
      },
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("returns 401 when user is not authenticated", async () => {
    mockedRequireAdminApiSession.mockResolvedValue({
      ok: false,
      status: 401,
      message: "Unauthorized.",
    });

    const request = new Request("http://localhost/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: "hello" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const payload = (await response.json()) as { error: string };

    expect(response.status).toBe(401);
    expect(payload.error).toBe("Unauthorized.");
    expect(mockedCheckRateLimit).not.toHaveBeenCalled();
  });

  it("returns 429 when rate-limited", async () => {
    mockedRequireAdminApiSession.mockResolvedValue({
      ok: true,
      session: {
        user: { id: "admin-id", role: "admin" },
        expires: "2099-01-01T00:00:00.000Z",
      },
    });
    mockedCheckRateLimit.mockResolvedValue({
      allowed: false,
      retryAfterSeconds: 42,
    });

    const request = new Request("http://localhost/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: "hello" }),
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "1.2.3.4",
      },
    });

    const response = await POST(request);
    const payload = (await response.json()) as { error: string };

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("42");
    expect(payload.error).toBe("Too many requests. Please try again later.");
  });

  it("returns safe error message when model response is invalid", async () => {
    mockedRequireAdminApiSession.mockResolvedValue({
      ok: true,
      session: {
        user: { id: "admin-id", role: "admin" },
        expires: "2099-01-01T00:00:00.000Z",
      },
    });
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => "not-json",
      },
    });

    const request = new Request("http://localhost/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: "hello" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const payload = (await response.json()) as { error: string };

    expect(response.status).toBe(500);
    expect(payload.error).toBe("Failed to generate content.");
    expect(payload.error).not.toContain("Invalid JSON");
  });
});
