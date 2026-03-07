"use client";

import {
    ArrowUpRight,
    Gem,
    ShieldCheck,
    Sparkles,
    Trophy,
    Volume2,
} from "lucide-react";

const practiceCards = [
    {
        label: "Quiz accuracy",
        value: "8/10 đúng",
        tone:
            "border-sky-200/60 bg-sky-50/80 text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300",
    },
    {
        label: "Story Cloze",
        value: "Kéo thả theo ngữ cảnh",
        tone:
            "border-emerald-200/60 bg-emerald-50/80 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300",
    },
    {
        label: "Progress sync",
        value: "Lưu tiến độ theo topic",
        tone:
            "border-amber-200/60 bg-amber-50/80 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300",
    },
];

const todayLoop = [
    "Mở topic Travel Essentials",
    "Lật 12 flashcards và nghe phát âm",
    "Làm 1 quiz ngắn",
    "Khóa phiên học bằng Story Cloze",
];

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
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
                                Product preview
                            </p>
                            <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                                Một phiên học đi từ input tới reward trong cùng
                                một màn hình.
                            </h2>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
                            Guest preview
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.18fr)_minmax(280px,0.82fr)]">
                        <div className="grid gap-4">
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
                                            Bộ từ đang học sẽ đi xuyên suốt từ
                                            flashcards sang quiz và bài Story
                                            Cloze.
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
                                                Cuộc phiêu lưu, chuyến đi cần sự
                                                chủ động và khám phá.
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
                                                when it appears inside a
                                                story.&rdquo;
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
                                                    Session output
                                                </p>
                                                <Trophy className="h-4 w-4" />
                                            </div>
                                            <p className="mt-4 text-2xl font-semibold tracking-tight">
                                                +24 XP
                                            </p>
                                            <p className="mt-1 text-sm text-white/70 dark:text-slate-600">
                                                Giữ streak, mở quiz tiếp theo và
                                                tích thêm Gem.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            <div className="grid gap-4 md:grid-cols-3">
                                {practiceCards.map((card) => (
                                    <div
                                        key={card.label}
                                        className={`rounded-[1.4rem] border p-4 ${card.tone}`}
                                    >
                                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
                                            {card.label}
                                        </p>
                                        <p className="mt-3 text-sm font-semibold leading-6">
                                            {card.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <article className="landing-subtle-panel rounded-[1.6rem] p-5">
                                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                                    Today&apos;s loop
                                </p>
                                <div className="mt-4 space-y-3">
                                    {todayLoop.map((item, index) => (
                                        <div
                                            key={item}
                                            className="flex gap-3 rounded-2xl border border-black/10 bg-white/70 px-3 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
                                        >
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
                                                {index + 1}
                                            </span>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <article className="landing-subtle-panel rounded-[1.6rem] p-5">
                                <div className="flex items-center justify-between">
                                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                                        Rewards
                                    </p>
                                    <Gem className="h-4 w-4 text-amber-500" />
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border border-black/10 bg-white/75 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Daily reward
                                        </p>
                                        <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                                            +5 Gems
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-black/10 bg-white/75 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Current streak
                                        </p>
                                        <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                                            Day 07
                                        </p>
                                    </div>
                                </div>
                            </article>

                            <article className="rounded-[1.6rem] border border-black/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] p-5 text-white shadow-[0_28px_60px_-38px_rgba(15,23,42,0.8)] dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/60 dark:text-slate-400">
                                            Profile loadout
                                        </p>
                                        <p className="mt-2 text-lg font-semibold">
                                            Avatar + frame từ shop learner
                                        </p>
                                    </div>
                                    <Sparkles className="h-5 w-5 text-emerald-300" />
                                </div>

                                <div className="mt-5 flex items-center gap-4">
                                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/40 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.45),rgba(255,255,255,0.08))]">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950/40 text-sm font-semibold">
                                            LL
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm text-white/70 dark:text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-emerald-300" />
                                            Equipped frame synced to profile
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Gem className="h-4 w-4 text-amber-300" />
                                            Inventory mở rộng theo phần thưởng
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
