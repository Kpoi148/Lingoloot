"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
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
        <Link
            href="/admin/profile"
            className="group mx-2 mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 transition hover:border-slate-300 hover:shadow-md"
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
                <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-blue-600">
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
    );
}
