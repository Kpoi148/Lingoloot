import { AnimatedSection } from "@/components/common/AnimatedSection";

export default function GamificationSection() {
    return (
        <AnimatedSection className="relative mx-auto w-full max-w-6xl px-4 pb-20">
            <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
                    Gamification
                </p>
                <h2 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                    Biến việc học thành trò chơi.
                </h2>
                <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
                    Từ câu chuyện, streak đến quiz cá nhân hoá, mỗi ngày học đều có mục tiêu rõ
                    ràng để bạn giữ hứng thú.
                </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-3">
                <StoryModeCard />
                <SmartStreakCard />
                <PersonalizedQuizCard />
                <MasteryTrackingCard />
            </div>
        </AnimatedSection>
    );
}

function StoryModeCard() {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-xl shadow-slate-200/60 dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-slate-950/40 md:col-span-2 lg:col-span-7 lg:row-span-3">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-400">
                        Story Mode
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        Học từ trong ngữ cảnh
                    </p>
                </div>
                <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                    Live
                </div>
            </div>

            <div className="mt-6 space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-5 dark:border-slate-800/80 dark:bg-slate-900/80">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Kéo thả từ vào khoảng trống để hoàn thành câu chuyện.
                </p>
                <div className="rounded-xl bg-white/90 p-4 shadow-inner shadow-slate-200/70 dark:bg-slate-950/70 dark:shadow-slate-950/40">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        I went on an{" "}
                        <span className="inline-flex items-center rounded-full border border-dashed border-emerald-300/80 px-4 py-1 text-xs font-semibold text-emerald-600 dark:border-emerald-500/50 dark:text-emerald-300">
                            ___
                        </span>{" "}
                        to the mountains.
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-sm">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                            adventure
                        </span>
                        <span className="text-slate-400 dark:text-slate-500">→</span>
                        <span className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs font-semibold text-slate-400 dark:border-slate-700 dark:text-slate-500">
                            thả vào
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SmartStreakCard() {
    return (
        <div className="rounded-3xl border border-amber-200/70 bg-amber-50/80 p-6 shadow-lg shadow-amber-100/70 dark:border-amber-500/30 dark:bg-amber-500/10 dark:shadow-amber-500/10 lg:col-span-5">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600 dark:text-amber-400">
                    Smart Streak
                </p>
                <span className="text-3xl">🔥</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Giữ lửa mỗi ngày
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Tạo thói quen học tập bằng chuỗi ngày liên tục.
            </p>
            <div className="mt-6 flex items-center gap-3">
                <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-amber-600 dark:bg-slate-900/80 dark:text-amber-300">
                    Day 7
                </div>
                <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-amber-600 dark:bg-slate-900/80 dark:text-amber-300">
                    +10 XP
                </div>
            </div>
        </div>
    );
}

function PersonalizedQuizCard() {
    return (
        <div className="rounded-3xl border border-sky-200/70 bg-sky-50/80 p-6 shadow-lg shadow-sky-100/70 dark:border-sky-500/30 dark:bg-sky-500/10 dark:shadow-sky-500/10 lg:col-span-5">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600 dark:text-sky-400">
                    Personalized Quiz
                </p>
                <span className="text-3xl">🎯</span>
            </div>
            <p className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
                Bài tập sinh ra từ chính từ vựng của bạn
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Luyện tập đúng những gì bạn vừa học để nhớ sâu hơn.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
                <span className="rounded-full bg-white/90 px-3 py-1 dark:bg-slate-900/80">Quiz 1</span>
                <span className="rounded-full bg-white/90 px-3 py-1 dark:bg-slate-900/80">Quiz 2</span>
                <span className="rounded-full bg-white/90 px-3 py-1 dark:bg-slate-900/80">Quiz 3</span>
            </div>
        </div>
    );
}

function MasteryTrackingCard() {
    return (
        <div className="rounded-3xl border border-emerald-200/70 bg-emerald-50/80 p-6 shadow-lg shadow-emerald-100/70 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:shadow-emerald-500/10 lg:col-span-5">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-400">
                    Mastery Tracking
                </p>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                    0% → 100%
                </span>
            </div>
            <p className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
                Theo dõi tiến độ rõ ràng
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Biết mình đang ở đâu để giữ nhịp học ổn định.
            </p>
            <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>0%</span>
                    <span>100%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-emerald-100 dark:bg-emerald-900/60">
                    <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 dark:from-emerald-400 dark:to-amber-300" />
                </div>
            </div>
        </div>
    );
}
