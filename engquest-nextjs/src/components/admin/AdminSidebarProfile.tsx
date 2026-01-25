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
        return frameId ? shopItems.find((i) => i._id === frameId) : null;
    }, [profile?.gamification?.equippedFrame, shopItems]);

    if (!profile) return null;

    return (
        <div className="mt-auto border-t border-slate-200 pt-4">
            <Link
                href="/admin/profile"
                className="group mb-2 flex items-center gap-3 rounded-2xl p-2 transition hover:bg-slate-50"
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
                    <p className="truncate text-sm font-semibold text-slate-900">
                        {profile.displayName || profile.name}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                            Lv. {levelProgress.level}
                        </span>
                        <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                style={{ width: `${levelProgress.percent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </Link>

            <button
                onClick={() => void signOut({ callbackUrl: "/" })}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-500 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
            >
                <LogOut className="h-3.5 w-3.5" />
                Đăng xuất
            </button>
        </div>
    );
}
