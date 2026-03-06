"use client";

import { useState, useMemo } from "react";
import { Check, Lock, Gift, Sparkles, Flame } from "lucide-react";
import confetti from "canvas-confetti";
import { checkDailyLogin } from "@/actions/user/gamification.actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/shared/utils";

// Define the type for user.gamification based on what we saw in gamification.actions.ts
// We might need to adjust this if the actual prop structure is different, but this matches the server action.
interface GamificationData {
    streak: number;
    lastLoginDate?: string | Date | null;
    xp?: number;
    // Add other fields as needed
}

interface StreakBoardProps {
    gamification: GamificationData;
}

export default function StreakBoard({ gamification }: StreakBoardProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // 1. Logic Mapping (Client Side)
    const currentStreak = gamification.streak || 0;

    // Determine current day in cycle (1-7)
    // If streak is 0, we can say day 1. 
    // If streak is 7, it's day 7 (7 % 7 === 0 || 7).
    const currentDayInCycle = (currentStreak % 7) || 7;

    // Check if today is already claimed
    const isClaimedToday = useMemo(() => {
        if (!gamification.lastLoginDate) return false;
        const lastLogin = new Date(gamification.lastLoginDate);
        const today = new Date();
        return (
            lastLogin.getDate() === today.getDate() &&
            lastLogin.getMonth() === today.getMonth() &&
            lastLogin.getFullYear() === today.getFullYear()
        );
    }, [gamification.lastLoginDate]);

    const handleClaim = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const result = await checkDailyLogin();
            if (result.status === "claimed") {
                // Trigger confetti if it's day 7 or just a nice effect
                if (currentDayInCycle === 6) { // 0-indexed check for 7th day? No, wait.
                    // If we are claiming, it means we ARE on the current day.
                    // If currentDayInCycle is 7, and we play, we get big reward.
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#FFD700', '#FFA500', '#FF4500']
                    });
                }

                router.refresh();
            }
        } catch (error) {
            console.error("Failed to claim reward:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            {/* Header Summary */}
            <div className="mb-6 flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                    <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        Chuỗi {currentStreak} ngày
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {isClaimedToday
                            ? "Tuyệt vời! Ngày mai lại ghé nhé!"
                            : "Đừng để mất chuỗi! Nhận quà ngay."}
                    </p>
                </div>
            </div>

            {/* 7-Day Grid */}
            <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
                {Array.from({ length: 7 }).map((_, idx) => {
                    const dayNumber = idx + 1;
                    const isSeventhDay = dayNumber === 7;

                    // Determine State
                    let state: "completed" | "active" | "locked" = "locked";

                    // If we have passed this day in the cycle, it's completed.
                    // Example: streak is 3. currentDayInCycle is 3.
                    // Day 1 (idx 0) < 3 -> completed.
                    // Day 2 (idx 1) < 3 -> completed.
                    // Day 3 (idx 2) == 3. If claimed today -> completed. Else -> active.

                    if (dayNumber < currentDayInCycle) {
                        state = "completed";
                    } else if (dayNumber === currentDayInCycle) {
                        state = isClaimedToday ? "completed" : "active";
                    } else {
                        // Future days
                        // Special case: if today is claimed, tomorrow is locked but "next"? 
                        // Requirement says: if index > currentDayInCycle -> Locked.
                        state = "locked";
                    }

                    // Visuals based on state
                    const isCompleted = state === "completed";
                    const isActive = state === "active";
                    const isLocked = state === "locked";

                    return (
                        <div
                            key={dayNumber}
                            className={cn(
                                "relative flex flex-col items-center justify-center rounded-2xl p-4 transition-all duration-300 border-2 min-h-[120px]",
                                // Completed
                                isCompleted && "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-500/30",
                                // Active
                                isActive && "bg-white border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.3)] scale-105 z-10 dark:bg-slate-800",
                                // Locked
                                isLocked && "bg-slate-50 border-slate-100 opacity-60 dark:bg-slate-800/50 dark:border-slate-800"
                            )}
                        >
                            <div className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                                Ngày {dayNumber}
                            </div>

                            {/* Icon / Content */}
                            <div className="flex-1 flex items-center justify-center">
                                {isCompleted ? (
                                    <div className="bg-emerald-100 p-2 rounded-full dark:bg-emerald-500/20">
                                        <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                ) : isSeventhDay ? (
                                    <div className="relative">
                                        <Gift className={cn(
                                            "w-8 h-8",
                                            isActive ? "text-orange-500 animate-bounce" : "text-slate-300"
                                        )} />
                                        {isActive && (
                                            <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 animate-spin-slow" />
                                        )}
                                    </div>
                                ) : (
                                    isActive ? (
                                        <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                                            {/* Placeholder for reward amount if we knew it, e.g. +10 XP */}
                                            <span className="text-orange-500">+{(dayNumber * 10) + 50}</span>
                                            <span className="block text-[10px] text-slate-400 font-normal">XP</span>
                                        </div>
                                    ) : (
                                        <Lock className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                                    )
                                )}
                            </div>

                            {/* Button for Active State */}
                            {isActive && (
                                <button
                                    onClick={handleClaim}
                                    disabled={loading}
                                    className="mt-2 w-full py-1.5 px-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
                                >
                                    {loading ? "..." : "Nhận quà"}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
