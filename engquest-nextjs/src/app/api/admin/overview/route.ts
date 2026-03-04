import { NextResponse } from "next/server";
import { createApiErrorResponse } from "@/lib/api-error";
import { requireAdminApiSession } from "@/lib/api-auth";
import { getCachedOverviewCounts } from "@/lib/cached-queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await requireAdminApiSession();
    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const counts = await getCachedOverviewCounts();

    return NextResponse.json({ data: counts });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/admin/overview",
      publicMessage: "Unable to load overview data.",
    });
  }
}
