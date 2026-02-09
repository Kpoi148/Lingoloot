import { Volume2 } from "lucide-react";

export default function FlashcardMockup() {
    return (
        <div className="relative hidden animate-fade-in-up lg:block">
            {/* Floating animation wrapper - using CSS animation */}
            <div className="relative animate-float">
                {/* Main Card */}
                <div className="relative w-72 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/90 dark:shadow-slate-950/50">
                    {/* Decorative gradient blob */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-200/50 blur-2xl dark:bg-emerald-500/20"
                    />

                    {/* Card Header */}
                    <div className="flex items-center justify-between">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                            Flashcard
                        </span>
                        <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:scale-110 hover:bg-slate-200 active:scale-95 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                            aria-label="Phát âm"
                        >
                            <Volume2 className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Word */}
                    <div className="mt-5">
                        <h3 className="font-[var(--font-display)] text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            adventure
                        </h3>
                        <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                            /ədˈventʃər/
                        </p>
                    </div>

                    {/* Meaning */}
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                            Nghĩa
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                            cuộc phiêu lưu, chuyến mạo hiểm
                        </p>
                    </div>

                    {/* Example */}
                    <div className="mt-3 rounded-2xl bg-amber-50/80 p-4 dark:bg-amber-500/10">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                            Ví dụ
                        </p>
                        <p className="mt-1 text-sm italic text-slate-600 dark:text-slate-300">
                            &ldquo;Life is either a daring{" "}
                            <span className="font-semibold text-amber-600 dark:text-amber-400">
                                adventure
                            </span>{" "}
                            or nothing at all.&rdquo;
                        </p>
                    </div>

                    {/* AI Badge */}
                    <div className="mt-4 flex items-center gap-2">
                        <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                            AI Generated
                        </span>
                    </div>
                </div>

                {/* Stacked cards behind (decorative) */}
                <div
                    aria-hidden="true"
                    className="absolute -bottom-2 -right-2 -z-10 h-full w-full rounded-3xl border border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50"
                />
                <div
                    aria-hidden="true"
                    className="absolute -bottom-4 -right-4 -z-20 h-full w-full rounded-3xl border border-slate-200/30 bg-white/30 dark:border-slate-800/30 dark:bg-slate-900/30"
                />
            </div>
        </div>
    );
}
