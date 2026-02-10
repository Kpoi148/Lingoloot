import { BookOpenText, Sparkles } from "lucide-react";
import { AnimatedSection } from "@/components/common/AnimatedSection";

export default function HowItWorksSection() {
    return (
        <AnimatedSection className="relative mx-auto w-full max-w-6xl px-4 pb-20 scroll-mt-28">
            <div
                id="how-it-works"
                className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-slate-950/40 sm:p-8"
            >
                <div className="max-w-2xl space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
                        Vì sao LingoLoot?
                    </p>
                    <h2 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                        Học từ vựng không còn nhàm chán nữa!
                    </h2>
                    <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg">
                        LingoLoot biến việc học thành hành trình chinh phục — với flashcard
                        trực quan, minigame hấp dẫn và phần thưởng mỗi ngày.
                    </p>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    {/* Old Way Card */}
                    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-400">
                        <div className="flex items-start gap-4">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                                <BookOpenText className="h-6 w-6" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                                    Cách cũ
                                </p>
                                <p className="mt-3 text-lg font-semibold text-slate-700 dark:text-slate-200">
                                    Học máy móc, thiếu động lực, dễ bỏ cuộc.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* LingoLoot Way Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-6 text-slate-700 shadow-2xl shadow-emerald-200/60 dark:border-emerald-500/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 dark:text-slate-200 dark:shadow-emerald-500/10">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-200/70 blur-3xl dark:bg-emerald-500/20"
                        />
                        <div className="flex items-start gap-4">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-300/60">
                                <Sparkles className="h-6 w-6" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-400">
                                    Cách LingoLoot
                                </p>
                                <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    Flashcard trực quan, Quiz thông minh, phần thưởng Gem mỗi
                                    ngày.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}

