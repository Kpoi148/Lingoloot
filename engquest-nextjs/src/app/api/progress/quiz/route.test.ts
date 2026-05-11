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

const mockedRequireUserApiSession =
  requireUserApiSession as jest.MockedFunction<typeof requireUserApiSession>;
const mockedConnectToDatabase = connectToDatabase as jest.MockedFunction<
  typeof connectToDatabase
>;

describe("POST /api/progress/quiz", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns 401 for anonymous requests", async () => {
    mockedRequireUserApiSession.mockResolvedValue({
      ok: false,
      status: 401,
      message: "Unauthorized.",
    });

    const response = await POST(
      new Request("http://localhost/api/progress/quiz", {
        method: "POST",
        body: JSON.stringify({
          category_id: "507f1f77bcf86cd799439011",
          proof: "proof-token",
        }),
        headers: { "Content-Type": "application/json" },
      })
    );
    const payload = (await response.json()) as { message: string };

    expect(response.status).toBe(401);
    expect(payload.message).toBe("Unauthorized.");
    expect(mockedConnectToDatabase).not.toHaveBeenCalled();
  });
});
