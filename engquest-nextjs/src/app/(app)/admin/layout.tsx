// Admin-only layout that applies protected admin navigation and chrome.
import Link from "next/link";
import AdminTopbarActions from "@/components/admin/layout/AdminTopbarActions";
import BrandLogo from "@/components/common/BrandLogo";
import { getUserProfile } from "@/actions/user/profile.actions";
import { getAdminShopItems } from "@/actions/admin/shop.actions";
import { getSession } from "@/lib/auth/auth-utils";
import { redirect } from "next/navigation";
import AdminSidebarProfile from "@/components/admin/layout/AdminSidebarProfile";
import AdminSidebarNav from "@/components/admin/layout/AdminSidebarNav";
import AdminMobileHeader from "@/components/admin/layout/AdminMobileHeader";
import ParticlesBackground from "@/components/ui/ParticlesBackground";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/");
  }
  if (session.user.role !== "admin") {
    redirect("/profile");
  }

  const profile = await getUserProfile();
  const shopItems = await getAdminShopItems();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 relative">
      {/* Background Particles */}
      <ParticlesBackground />

      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] relative z-10">
        {/* Mobile Header & Drawer */}
        <AdminMobileHeader profile={profile} shopItems={shopItems} />

        {/* Desktop Sidebar */}
        <aside className="sticky top-0 hidden h-screen max-h-screen w-72 flex-col overflow-y-auto border-r border-slate-200/70 bg-white/80 px-4 py-6 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80 md:flex">
          <Link href="/" className="mb-8 flex items-center gap-3 px-2">
            <BrandLogo className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white shadow-md shadow-slate-900/20 dark:bg-white dark:text-slate-900" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                LingoLoot
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin Portal</p>
            </div>
          </Link>

          <AdminSidebarNav />

          {/* Admin Sidebar Profile (Bottom) */}
          <AdminSidebarProfile profile={profile} shopItems={shopItems} />
        </aside>

        <div className="flex flex-1 flex-col min-w-0">
          {/* Desktop Topbar */}
          <header className="sticky top-0 z-30 hidden border-b border-slate-200/70 bg-white/80 px-6 py-4 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80 md:block">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Dashboard
                </h1>
              </div>
              <AdminTopbarActions />
            </div>
          </header>

          <main className="flex-1 px-3 py-4 sm:px-6 sm:py-8 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
