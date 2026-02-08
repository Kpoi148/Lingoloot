"use client";

import Link from "next/link";
import { type UserProfile } from "@/actions/user/profile.actions";
import { getLevelProgress, getLevelTitle } from "@/lib/gamification";
import StreakNavbarItem from "@/components/gamification/StreakNavbarItem";
import { FrameRenderer } from "@/components/shop/FrameRenderer";

type NavbarUserMenuProps = {
    profile: UserProfile | null;
    displayName: string;
    avatarUrl?: string;
    avatarLetter: string;
};

/**
 * Desktop user menu component - Single Responsibility
 * Displays user avatar, level progress, gems, and badges
 */
export default function NavbarUserMenu({
    profile,
    displayName,
    avatarUrl,
    avatarLetter,
}: NavbarUserMenuProps) {
    const levelProgress = getLevelProgress(profile?.gamification?.xp ?? 0);
    const levelTitle = getLevelTitle(levelProgress.level);
    const gems = profile?.gamification?.currency ?? 0;
    const badges = profile?.gamification?.inventory ?? [];

    return (
        <div className="flex w-full max-w-md items-center gap-3 rounded-3xl border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition dark:border-slate-800 dark:bg-slate-900 md:w-auto">
            {/* Avatar */}
            <Link href="/profile" className="group">
                <div
                    className={`transition group-hover:scale-105 ${profile?.gamification?.equippedFrameDetails
                        ? ""
                        : "rounded-full bg-gradient-to-br from-amber-200 via-slate-100 to-slate-200 p-0.5 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700"
                        }`}
                >
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

            {/* User Info */}
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

                {/* Stats */}
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
    );
}
