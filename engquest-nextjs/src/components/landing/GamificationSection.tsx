// Landing section that surfaces streaks, XP, Gems, and profile rewards.
import type { ReactNode } from "react";
import { Flame, Gem, Gift, Trophy } from "lucide-react";
import { AnimatedSection } from "@/components/common/AnimatedSection";

const streakDays = [
    { label: "Mon", active: true },
    { label: "Tue", active: true },
    { label: "Wed", active: true },
    { label: "Thu", active: true },
    { label: "Fri", active: true },
    { label: "Sat", active: true },
    { label: "Sun", active: false },
];

export default function GamificationSection() {
    return (
        <AnimatedSection
            id="rewards"
            className="relative mx-auto w-full max-w-7xl scroll-mt-32 px-4 pb-24 sm:px-6 lg:px-8"
        >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.03fr)_minmax(0,0.97fr)]">
                <article className="landing-panel overflow-hidden rounded-[2rem] p-6">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
                        Motivation layer
                    </p>
                    <h2 className="mt-3 max-w-xl font-[var(--font-display)] text-3xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white sm:text-4xl">
                        Reward loop đủ rõ để người học muốn quay lại.
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                        Giữ streak, nhận XP và Gems, rồi thấy ngay thay đổi ở
                        profile.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <StatCard
                            icon={<Flame className="h-4 w-4 text-amber-500" />}
                            label="Daily streak"
                            value="07 days"
                        />
                        <StatCard
                            icon={<Trophy className="h-4 w-4 text-sky-500" />}
                            label="Level progress"
                            value="Lv. 4 Explorer"
                        />
                        <StatCard
                            icon={<Gem className="h-4 w-4 text-emerald-500" />}
                            label="Gem balance"
                            value="125 gems"
                        />
                    </div>

                    <div className="mt-6 rounded-[1.7rem] border border-black/10 bg-slate-950 px-5 py-5 text-white shadow-[0_28px_60px_-36px_rgba(15,23,42,0.78)] dark:border-white/10 dark:bg-white dark:text-slate-950 dark:shadow-[0_28px_60px_-36px_rgba(255,255,255,0.3)]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/60 dark:text-slate-500">
                                    Daily reward board
                                </p>
                                <p className="mt-2 text-xl font-semibold">
                                    Chuỗi ngày học hiện rõ ngay trên navbar và
                                    profile.
                                </p>
                            </div>
                            <Gift className="h-5 w-5 text-emerald-300 dark:text-emerald-600" />
                        </div>

                        <div className="mt-5 grid grid-cols-7 gap-2">
                            {streakDays.map((day) => (
                                <div
                                    key={day.label}
                                    className={`rounded-2xl border px-3 py-3 text-center ${
                                        day.active
                                            ? "border-emerald-300/40 bg-emerald-400/20 text-white dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-slate-950"
                                            : "border-white/10 bg-white/5 text-white/60 dark:border-slate-300/20 dark:bg-slate-950/5 dark:text-slate-500"
                                    }`}
                                >
                                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em]">
                                        {day.label}
                                    </p>
                                    <p className="mt-2 text-sm font-semibold">
                                        {day.active ? "Claimed" : "Next"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </article>

                <div className="grid gap-4 sm:grid-cols-2">
                    <article className="landing-subtle-panel rounded-[1.7rem] p-5">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                            XP to level
                        </p>
                        <p className="mt-3 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                            Mỗi bài học đẩy level lên thêm một đoạn.
                        </p>
                        <div className="mt-5 rounded-2xl border border-black/10 bg-white/75 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                                <span>Lv. 4</span>
                                <span>320 / 400 XP</span>
                            </div>
                            <div className="mt-3 h-2.5 rounded-full bg-black/5 dark:bg-white/10">
                                <div className="h-2.5 w-4/5 rounded-full bg-[linear-gradient(90deg,#0f172a_0%,#2563eb_55%,#10b981_100%)] dark:bg-[linear-gradient(90deg,#f8fafc_0%,#7dd3fc_50%,#6ee7b7_100%)]" />
                            </div>
                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                                Một lượt học, một khoảng tiến bộ được nhìn
                                thấy.
                            </p>
                        </div>
                    </article>

                    <article className="landing-subtle-panel rounded-[1.7rem] p-5">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                            Cosmetics
                        </p>
                        <p className="mt-3 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                            Gems đổi thành avatar và frame.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {["Avatar", "Frame", "Inventory", "Equip"].map(
                                (item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"
                                    >
                                        {item}
                                    </span>
                                )
                            )}
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            Reward được thấy lại mỗi ngày trong profile.
                        </p>
                    </article>
                </div>
            </div>
        </AnimatedSection>
    );
}

function StatCard({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-[1.5rem] border border-black/10 bg-white/75 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                {icon}
                <span>{label}</span>
            </div>
            <p className="mt-3 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                {value}
            </p>
        </div>
    );
}
