"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { UserProfile } from "@/actions/profile.actions";
import { getLevelProgress } from "@/lib/gamification";
import { FrameRenderer } from "@/lib/frame-registry";

type AdminSidebarProfileProps = {
    profile: UserProfile | null;
    shopItems?: any[];
};

export default function AdminSidebarProfile({
    profile,
    shopItems = [],
}: AdminSidebarProfileProps) {
    const levelProgress = useMemo(() => {
        const xp = profile?.gamification?.xp ?? 0;
        return getLevelProgress(xp);
    }, [profile?.gamification?.xp]);

    const equippedFrameItem = useMemo(() => {
        const frameId = profile?.gamification?.equippedFrame;
        if (!frameId) return null;
        return shopItems.find((i) => String(i._id) === String(frameId));
    }, [profile?.gamification?.equippedFrame, shopItems]);

    if (!profile) return null;

    return (
        <>
            <div className="mt-auto px-2 pb-2">
                <button
                    onClick={() => void signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                </button>
            </div>

            <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                <Link
                    href="/admin/profile"
                    className="group flex items-center gap-3 rounded-2xl p-2 transition hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                    <div className="relative h-10 w-10 flex-shrink-0">
                        <FrameRenderer
                            frameKey={equippedFrameItem?.renderKey}
                            fallbackImageUrl={equippedFrameItem?.imageUrl}
                            avatarUrl={profile.avatarUrl}
                            className="h-full w-full"
                        />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {profile.displayName || profile.name}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                Lv. {levelProgress.level}
                            </span>
                            <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                    style={{ width: `${levelProgress.percent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    );
}
