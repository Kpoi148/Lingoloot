"use client";
// Profile stats panel that summarizes learner progress, streaks, and rewards.

import { useMemo } from "react";
import { Activity, BookOpen, Target, type LucideIcon } from "lucide-react";
import { getLevelProgress, getLevelTitle } from "@/lib/gamification/gamification";

type UserStats = {
    totalVocabAdded: number;
    quizzesTaken: number;
    quizAccuracy: number;
};

type UserGamification = {
    xp: number;
    level: number;
    streak: number;
    currency: number;
    inventory: string[];
};

type ProfileStatsProps = {
    stats?: UserStats;
    gamification?: UserGamification;
};

const numberFormatter = new Intl.NumberFormat("en-US");

const normalizeAccuracy = (value: number) => {
    if (!Number.isFinite(value)) return 0;
    if (value > 100) return 100;
    if (value < 0) return 0;
    return Math.round(value);
};

type StatItem = {
    label: string;
    value: string;
    icon: LucideIcon;
    accent: string;
};

/**
 * ProfileStats - Displays user learning statistics
 * Single Responsibility: Show stats and level progress
 */
export default function ProfileStats({ stats, gamification }: ProfileStatsProps) {
    const levelProgress = useMemo(() => {
        const xp = gamification?.xp ?? 0;
        return getLevelProgress(xp);
    }, [gamification?.xp]);

    const levelTitle = getLevelTitle(levelProgress.level);

    const statItems: StatItem[] = useMemo(() => {
        if (!stats) return [];
        return [
            {
                label: "Tổng từ đã thêm",
                value: numberFormatter.format(stats.totalVocabAdded),
                icon: BookOpen,
                accent: "bg-emerald-50 text-emerald-600",
            },
            {
                label: "Độ chính xác Quiz",
                value: `${normalizeAccuracy(stats.quizAccuracy)}%`,
                icon: Target,
                accent: "bg-sky-50 text-sky-600",
            },
            {
                label: "Số Quiz đã làm",
                value: numberFormatter.format(stats.quizzesTaken),
                icon: Activity,
                accent: "bg-amber-50 text-amber-600",
            },
        ];
    }, [stats]);

    const hasProfile = stats && gamification;

    return (
        <section className="flex w-full flex-1 flex-col rounded-3xl border border-edge bg-surface-card p-6 shadow-lg shadow-shadow-theme">
            {/* Header */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-content-muted">
                    Thống kê học tập
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-content">
                    Tổng quan tiến độ
                </h2>
                <p className="mt-2 text-sm text-content-secondary">
                    Tóm tắt hiệu suất học tập của bạn.
                </p>
            </div>

            {/* Level Progress */}
            <div className="mt-6 rounded-2xl border border-edge bg-surface-muted p-4">
                {!hasProfile && (
                    <p className="text-sm text-content-muted">
                        Đăng nhập để xem tiến độ cấp độ.
                    </p>
                )}

                {hasProfile && (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
                                Lv. {levelProgress.level} {levelTitle}
                            </span>
                            <span className="text-xs font-semibold text-content-muted">
                                {numberFormatter.format(levelProgress.progress)} /{" "}
                                {numberFormatter.format(levelProgress.required)} XP
                            </span>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-progress-track">
                            <div
                                className="h-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-500"
                                style={{ width: `${levelProgress.percent}%` }}
                            />
                        </div>
                        <p className="mt-2 text-xs text-content-muted">
                            {numberFormatter.format(levelProgress.remaining)} XP để lên cấp
                            tiếp theo
                        </p>
                    </>
                )}
            </div>

            {/* Stats Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {!hasProfile && (
                    <div className="rounded-2xl border border-dashed border-edge bg-surface-muted p-6 text-sm text-content-muted sm:col-span-2 xl:col-span-3">
                        Chưa có dữ liệu thống kê.
                    </div>
                )}

                {hasProfile &&
                    statItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.label}
                                className="rounded-2xl border border-edge bg-surface-card p-5 shadow-sm"
                            >
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${item.accent}`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                                <p className="mt-4 text-3xl font-semibold text-content">
                                    {item.value}
                                </p>
                                <p className="mt-2 text-sm text-content-muted">{item.label}</p>
                            </div>
                        );
                    })}
            </div>
        </section>
    );
}
