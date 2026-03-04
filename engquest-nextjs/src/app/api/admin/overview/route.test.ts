/** @jest-environment node */

import { GET } from "./route";
import { getCachedOverviewCounts } from "@/lib/cached-queries";
import { requireAdminApiSession } from "@/lib/api-auth";

jest.mock("@/lib/api-auth", () => ({
  requireAdminApiSession: jest.fn(),
}));

jest.mock("@/lib/cached-queries", () => ({
  getCachedOverviewCounts: jest.fn(),
}));

const mockedRequireAdminApiSession =
  requireAdminApiSession as jest.MockedFunction<typeof requireAdminApiSession>;
const mockedGetCachedOverviewCounts =
  getCachedOverviewCounts as jest.MockedFunction<typeof getCachedOverviewCounts>;

describe("GET /api/admin/overview", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns 401 for anonymous requests", async () => {
    mockedRequireAdminApiSession.mockResolvedValue({
      ok: false,
      status: 401,
      message: "Unauthorized.",
    });

    const response = await GET();
    const payload = (await response.json()) as { message: string };

    expect(response.status).toBe(401);
    expect(payload.message).toBe("Unauthorized.");
    expect(mockedGetCachedOverviewCounts).not.toHaveBeenCalled();
  });

  it("returns 403 for non-admin users", async () => {
    mockedRequireAdminApiSession.mockResolvedValue({
      ok: false,
      status: 403,
      message: "Forbidden.",
    });

    const response = await GET();
    const payload = (await response.json()) as { message: string };

    expect(response.status).toBe(403);
    expect(payload.message).toBe("Forbidden.");
    expect(mockedGetCachedOverviewCounts).not.toHaveBeenCalled();
  });

  it("returns overview data for admins", async () => {
    mockedRequireAdminApiSession.mockResolvedValue({
      ok: true,
      session: {
        user: { id: "admin-id", role: "admin" },
        expires: "2099-01-01T00:00:00.000Z",
      },
    });
    mockedGetCachedOverviewCounts.mockResolvedValue({
      vocabularyCount: 1,
      categoryCount: 2,
      quizCount: 3,
      userCount: 4,
    });

    const response = await GET();
    const payload = (await response.json()) as {
      data: { vocabularyCount: number };
    };

    expect(response.status).toBe(200);
    expect(payload.data.vocabularyCount).toBe(1);
  });
});
