"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu, X, ShoppingBag } from "lucide-react";
import { getUserProfile, type UserProfile } from "@/actions/profile.actions";
import { getLevelProgress, getLevelTitle } from "@/lib/gamification";
import StreakNavbarItem from "@/components/StreakNavbarItem";
import { FrameRenderer } from "@/lib/frame-registry";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Học tập", href: "/topics" },
  { label: "Trò chơi", href: "/learn/practice" },
];

export default function Navbar({
  userName,
  userAvatarUrl,
}: {
  userName?: string;
  userAvatarUrl?: string;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const displayName =
    profile?.displayName?.trim() || userName?.trim() || "Người dùng";
  const avatarLetter = displayName.slice(0, 1).toUpperCase();
  const avatarUrl = profile?.avatarUrl?.trim() || userAvatarUrl?.trim();
  const levelProgress = useMemo(() => {
    const xp = profile?.gamification?.xp ?? 0;
    return getLevelProgress(xp);
  }, [profile?.gamification?.xp]);
  const levelTitle = getLevelTitle(levelProgress.level);
  const streak = profile?.gamification?.streak ?? 0;
  const gems = profile?.gamification?.currency ?? 0;
  const badges = profile?.gamification?.inventory ?? [];

  useEffect(() => {
    let active = true;
    getUserProfile()
      .then((data) => {
        if (active) {
          setProfile(data);
        }
      })
      .catch(() => {
        if (active) {
          setProfile(null);
        }
      });
    return () => {
      active = false;
    };
  }, [userName, userAvatarUrl]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full items-center justify-between px-4 py-3">
        <Link href="/topics" className="flex items-center gap-3">
          <BrandLogo className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white shadow-md shadow-slate-900/20 dark:bg-white dark:text-slate-900" />
          <span className="hidden sm:block text-sm font-semibold uppercase tracking-[0.3em] text-slate-700 dark:text-slate-200">
            LingoLoot
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${isActive
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Shop Icon - Visible on Mobile too */}
          <Link href="/shop" className="flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-emerald-400">
            <ShoppingBag className="w-5 h-5" />
          </Link>

          {/* Theme Toggle - Visible on Mobile too */}
          <ThemeToggle />

          {/* Desktop Only Elements */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex w-full max-w-md items-center gap-3 rounded-3xl border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition dark:border-slate-800 dark:bg-slate-900 md:w-auto">
              {/* Desktop Profile Card Content */}
              <Link href="/profile" className="group">
                {/* Desktop Avatar Container */}
                <div className={`transition group-hover:scale-105 ${profile?.gamification?.equippedFrameDetails
                    ? "" // If frame equipped: No border/bg ring, let frame handle shape
                    : "rounded-full bg-gradient-to-br from-amber-200 via-slate-100 to-slate-200 p-0.5 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700"
                  }`}>
                  {avatarUrl || profile?.gamification?.equippedFrameDetails ? (
                    <FrameRenderer
                      frameKey={profile?.gamification?.equippedFrameDetails?.renderKey}
                      fallbackImageUrl={profile?.gamification?.equippedFrameDetails?.imageUrl}
                      avatarUrl={avatarUrl}
                      className="h-12 w-12"
                    />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-200">
                      {avatarLetter}
                    </span>
                  )}
                </div>
              </Link>

              <div className="min-w-0 flex-1 flex flex-col justify-center">
                <Link href="/profile" className="group block">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                      {displayName}
                    </p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                      Lv. {levelProgress.level} {levelTitle}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-500"
                      style={{ width: `${levelProgress.percent}%` }}
                    />
                  </div>
                </Link>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-300">
                  {profile && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <StreakNavbarItem gamification={profile.gamification} />
                    </div>
                  )}
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 dark:border-slate-700 dark:bg-slate-900">
                    {gems} 💎
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 dark:border-slate-700 dark:bg-slate-900">
                    Huy hiệu: {badges.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
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
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-slate-200/70 bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 md:hidden"
        >
          <div className="flex flex-col gap-6">

            {/* Mobile Profile Card */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className={`h-12 w-12 relative ${profile?.gamification?.equippedFrameDetails
                  ? "flex-shrink-0" // Frame handles shape
                  : "rounded-full border border-slate-200 overflow-hidden" // Default circle
                }`}>
                {avatarUrl || profile?.gamification?.equippedFrameDetails ? (
                  <FrameRenderer
                    frameKey={profile?.gamification?.equippedFrameDetails?.renderKey}
                    fallbackImageUrl={profile?.gamification?.equippedFrameDetails?.imageUrl}
                    avatarUrl={avatarUrl}
                    className="h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">{avatarLetter}</div>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{displayName}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>Lv. {levelProgress.level} {levelTitle}</span>
                  <span>•</span>
                  <span>{gems} Gems</span>
                  <span>•</span>
                  <span>{badges.length} Huy hiệu</span>
                  <span>•</span>
                  {profile && <div className="scale-75 origin-left"><StreakNavbarItem gamification={profile.gamification} align="left" /></div>}
                </div>
              </div>
              <Link href="/profile" className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full" onClick={() => setMenuOpen(false)}>
                Hồ sơ
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-600 bg-slate-50 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>


          </div>
        </div>
      )}
    </nav>
  );
}
