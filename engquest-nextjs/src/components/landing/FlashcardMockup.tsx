"use client";
// Landing showcase block that previews one learner session without repeating the whole marketing stack.

import { CheckCircle2, Volume2 } from "lucide-react";

export default function FlashcardMockup() {
    const handleSpeak = () => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("adventure");
        utterance.lang = "en-US";
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <section id="product" className="scroll-mt-32">
            <div className="landing-panel relative overflow-hidden rounded-[2rem] p-4 sm:p-6">
                <div
                    aria-hidden="true"
                    className="landing-grid absolute inset-0 opacity-45"
                />
                <div
                    aria-hidden="true"
                    className="absolute left-1/2 top-0 h-60 w-60 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-400/10"
                />

                <div className="relative">
                    <div className="mb-6 max-w-3xl space-y-2">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
                            Study session preview
                        </p>
                        <h2 className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                            Một phiên học đi từ flashcard đến quiz và Story
                            Cloze như thế nào.
                        </h2>
                    </div>

                    <article className="landing-subtle-panel rounded-[1.75rem] p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                                    Topic active
                                </p>
                                <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                                    Travel Essentials
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    Một topic giữ nguyên xuyên suốt từ
                                    flashcard sang quiz và Story Cloze.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 lg:max-w-[220px] lg:justify-end">
                                {["travel", "plans", "airport", "journey"].map(
                                    (tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300"
                                        >
                                            {tag}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
                            <div className="relative overflow-hidden rounded-[1.5rem] border border-black/10 bg-white/85 p-5 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-slate-950/60">
                                <div
                                    aria-hidden="true"
                                    className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-sky-200/50 blur-2xl dark:bg-sky-400/10"
                                />
                                <div className="flex items-center justify-between">
                                    <span className="rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                                        Flashcard
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleSpeak}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/85 text-slate-500 transition hover:scale-105 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:text-white"
                                        aria-label="Phát âm"
                                    >
                                        <Volume2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="mt-5">
                                    <h3 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                                        adventure
                                    </h3>
                                    <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                                        /ad-ven-ture/
                                    </p>
                                </div>

                                <div className="mt-5 rounded-[1.3rem] border border-black/10 bg-slate-950/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">
                                        Nghĩa
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                        Cuộc phiêu lưu, chuyến đi cần sự chủ
                                        động và khám phá.
                                    </p>
                                </div>

                                <div className="mt-3 rounded-[1.3rem] border border-amber-200/60 bg-amber-50/80 p-4 dark:border-amber-400/20 dark:bg-amber-500/10">
                                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-amber-700 dark:text-amber-300">
                                        Ví dụ
                                    </p>
                                    <p className="mt-2 text-sm italic leading-6 text-slate-700 dark:text-slate-200">
                                        &ldquo;Every new word becomes an
                                        <span className="font-semibold text-amber-700 dark:text-amber-300">
                                            {" "}
                                            adventure
                                        </span>{" "}
                                        when it appears inside a story.&rdquo;
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <div className="rounded-[1.4rem] border border-black/10 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">
                                        Flashcard queue
                                    </p>
                                    <div className="mt-4 space-y-2">
                                        {[
                                            "journey",
                                            "explore",
                                            "destination",
                                        ].map((word) => (
                                            <div
                                                key={word}
                                                className="flex items-center justify-between rounded-2xl border border-black/10 bg-slate-950/[0.03] px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200"
                                            >
                                                <span>{word}</span>
                                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                                    ready
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-[1.4rem] border border-black/10 bg-slate-950 px-4 py-4 text-white dark:border-white/10 dark:bg-white dark:text-slate-950">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-white/60 dark:text-slate-500">
                                            Session status
                                        </p>
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <p className="mt-4 text-2xl font-semibold tracking-tight">
                                        12 cards reviewed
                                    </p>
                                    <p className="mt-1 text-sm text-white/70 dark:text-slate-600">
                                        Sẵn sàng sang quiz và lưu progress.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}
