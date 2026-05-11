/** @jest-environment node */
/// <reference types="jest" />

import { POST } from "./route";
import { requireUserApiSession } from "@/lib/auth/api-auth";
import { connectToDatabase } from "@/lib/db/mongodb";

jest.mock("@/lib/auth/api-auth", () => ({
  requireUserApiSession: jest.fn(),
}));

jest.mock("@/lib/db/mongodb", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("@/models/Category", () => ({
  __esModule: true,
  default: {
    exists: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock("@/lib/security/progress-proof", () => ({
  createProgressProof: jest.fn(),
}));

const mockedRequireUserApiSession =
  requireUserApiSession as jest.MockedFunction<typeof requireUserApiSession>;
const mockedConnectToDatabase = connectToDatabase as jest.MockedFunction<
  typeof connectToDatabase
>;

describe("POST /api/progress/proof", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns 401 for anonymous requests", async () => {
    mockedRequireUserApiSession.mockResolvedValue({
      ok: false,
      status: 401,
      message: "Unauthorized.",
    });

    const response = await POST(
      new Request("http://localhost/api/progress/proof", {
        method: "POST",
        body: JSON.stringify({ type: "quiz", category_slug: "basics" }),
        headers: { "Content-Type": "application/json" },
      })
    );
    const payload = (await response.json()) as { message: string };

    expect(response.status).toBe(401);
    expect(payload.message).toBe("Unauthorized.");
    expect(mockedConnectToDatabase).not.toHaveBeenCalled();
  });

  it("does not expose internal errors", async () => {
    mockedRequireUserApiSession.mockResolvedValue({
      ok: true,
      session: {
        user: { id: "user-1", role: "user" },
        expires: "2099-01-01T00:00:00.000Z",
      },
    });
    mockedConnectToDatabase.mockRejectedValue(
      new Error("database password leaked")
    );

    const response = await POST(
      new Request("http://localhost/api/progress/proof", {
        method: "POST",
        body: JSON.stringify({
          type: "quiz",
          category_id: "507f1f77bcf86cd799439011",
        }),
        headers: { "Content-Type": "application/json" },
      })
    );
    const payload = (await response.json()) as { message: string };

    expect(response.status).toBe(500);
    expect(payload.message).toBe("Unable to generate progress proof.");
    expect(payload.message).not.toContain("database password leaked");
  });
});
