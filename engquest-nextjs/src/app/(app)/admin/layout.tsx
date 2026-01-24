import Link from "next/link";
import {
  BookOpen,
  LayoutDashboard,
  ListChecks,
  Layers,
  Users,
  ShoppingBag,
} from "lucide-react";
import AdminTopbarActions from "@/components/admin/AdminTopbarActions";
import BrandLogo from "@/components/BrandLogo";

const navItems = [
  { label: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { label: "Quản lý từ vựng", href: "/admin/vocabularies", icon: BookOpen },
  { label: "Quản lý chủ đề", href: "/admin/categories", icon: Layers },
  { label: "Quản lý bài tập Quiz", href: "/admin/quizzes", icon: ListChecks },
  { label: "Quản lý người dùng", href: "/admin/users", icon: Users },
  { label: "Cửa hàng", href: "/admin/shop", icon: ShoppingBag },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white/80 px-4 py-6 md:flex">
          <Link href="/" className="mb-8 flex items-center gap-3 px-2">
            <BrandLogo className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white shadow-md shadow-slate-900/20" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                LingoLoot
              </p>
              <p className="text-sm font-semibold text-slate-900">Admin</p>
            </div>
          </Link>

          <nav className="flex flex-1 flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
            Quản trị nội dung và theo dõi hoạt động học tập.
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white shadow-md shadow-slate-900/20">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Quản trị viên
                  </p>
                  <p className="text-xs text-slate-500">
                    Đang quản lý nội dung hệ thống
                  </p>
                </div>
              </div>
              <AdminTopbarActions />
            </div>

            <div className="mt-4 flex flex-wrap gap-2 md:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </header>

          <main className="flex-1 px-4 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
