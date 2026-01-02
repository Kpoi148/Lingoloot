import { NextResponse } from "next/server";
import { getCachedOverviewCounts } from "../../../../lib/cached-queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const counts = await getCachedOverviewCounts();

    return NextResponse.json({ data: counts });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load overview data.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
