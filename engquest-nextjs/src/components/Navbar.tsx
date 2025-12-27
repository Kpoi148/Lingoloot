"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { ChevronDown, LogOut, Menu, Settings, UserCircle, X } from "lucide-react";

const navItems = [
  { label: "Học tập", href: "/topics" },
  { label: "Bài tập", href: "/exercises" },
  { label: "Xếp hạng", href: "/leaderboard" },
];

const userMenuItems = [
  { label: "Hồ sơ", href: "/profile", icon: UserCircle },
  { label: "Cài đặt", href: "/settings", icon: Settings },
  { label: "Đăng xuất", action: "signout", icon: LogOut },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white shadow-md shadow-slate-900/20 dark:bg-white dark:text-slate-900">
            LL
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-700 dark:text-slate-200">
            LingoLoot
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${
                  isActive
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              aria-expanded={userMenuOpen}
              aria-haspopup="menu"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                U
              </span>
              <span className="hidden sm:inline">Người dùng</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950">
                {userMenuItems.map((item) => {
                  const Icon = item.icon;
                  if (item.action === "signout") {
                    return (
                      <button
                        key={item.label}
                        type="button"
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900"
                        onClick={() => {
                          setUserMenuOpen(false);
                          void signOut({ callbackUrl: "/" });
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-slate-200/70 bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 md:hidden"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2 border-t border-slate-200/70 pt-4 dark:border-slate-800">
              {userMenuItems.map((item) => {
                const Icon = item.icon;
                if (item.action === "signout") {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className="flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                      onClick={() => {
                        setMenuOpen(false);
                        void signOut({ callbackUrl: "/" });
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
