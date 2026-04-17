// Admin dashboard landing page with overview metrics and quick actions.
import {
  getCachedDashboardAnalytics,
  getCachedOverviewCounts,
} from "@/lib/db/cached-queries";
import AdminDashboardClient from "@/components/admin/dashboard/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Removed profile and shop items fetching for dashboard

  let overviewData = null;
  let analyticsData = null;
  let error = null;

  try {
    [overviewData, analyticsData] = await Promise.all([
      getCachedOverviewCounts(),
      getCachedDashboardAnalytics(),
    ]);
  } catch {
    error = "Không thể tải dữ liệu thống kê.";
  }

  return (
    <AdminDashboardClient
      overviewData={overviewData}
      analyticsData={analyticsData}
      error={error}
    />
  );
}
