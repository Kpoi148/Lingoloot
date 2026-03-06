import { getCachedOverviewCounts } from "@/lib/db/cached-queries";
import AdminDashboardClient from "@/components/admin/dashboard/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Removed profile and shop items fetching for dashboard

  let overviewData = null;
  let error = null;

  try {
    overviewData = await getCachedOverviewCounts();
  } catch {
    error = "Không thể tải dữ liệu thống kê.";
  }

  return (
    <AdminDashboardClient
      overviewData={overviewData}
      error={error}
    />
  );
}
