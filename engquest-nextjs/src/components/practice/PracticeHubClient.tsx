"use client";

import { MousePointer2, Puzzle, SearchX, Sparkles } from "lucide-react";
import PracticeGameCard from "@/components/practice/PracticeGameCard";
import PracticeToolbar from "@/components/practice/PracticeToolbar";
import type { PracticeGameRecord } from "@/components/practice/types";
import { usePracticeHubController } from "@/components/practice/usePracticeHubController";

type PracticeHubClientProps = {
  games: PracticeGameRecord[];
};

export default function PracticeHubClient({
  games,
}: PracticeHubClientProps) {
  const {
    query,
    activeTopic,
    filteredGames,
    summary,
    topics,
    resultLabel,
    hasActiveFilters,
    setQuery,
    setActiveTopic,
    clearFilters,
  } = usePracticeHubController(games);

  const stats = [
    {
      label: "Màn đang mở",
      value: summary.totalGames,
      tone:
        "bg-sky-500/[0.12] text-sky-700 dark:bg-sky-500/[0.18] dark:text-sky-100",
      icon: Puzzle,
    },
    {
      label: "Chủ đề",
      value: summary.totalTopics,
      tone:
        "bg-violet-500/[0.12] text-violet-700 dark:bg-violet-500/[0.18] dark:text-violet-100",
      icon: Sparkles,
    },
    {
      label: "Ô trống",
      value: summary.totalGaps,
      tone:
        "bg-amber-500/[0.12] text-amber-800 dark:bg-amber-500/[0.18] dark:text-amber-100",
      icon: MousePointer2,
    },
    {
      label: "Mới cập nhật",
      value: summary.freshGames,
      tone:
        "bg-emerald-500/[0.12] text-emerald-700 dark:bg-emerald-500/[0.18] dark:text-emerald-100",
      icon: Sparkles,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-16 pt-8 text-content sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[360px] bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_26%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.9))] dark:bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.12),transparent_22%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_26%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.94))]"
      />
      <div
        aria-hidden="true"
        className="absolute left-[-5rem] top-[14rem] -z-10 h-64 w-64 rounded-full bg-amber-300/18 blur-3xl dark:bg-amber-500/8"
      />
      <div
        aria-hidden="true"
        className="absolute right-[-4rem] top-[20rem] -z-10 h-72 w-72 rounded-full bg-sky-300/18 blur-3xl dark:bg-sky-500/10"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-[30px] border border-black/[0.08] bg-white/80 p-5 shadow-[0_34px_90px_-54px_rgba(15,23,42,0.48)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/76 dark:shadow-[0_34px_90px_-54px_rgba(2,6,23,0.9)] sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-[0_20px_44px_-24px_rgba(15,23,42,0.82)] dark:from-slate-200 dark:via-white dark:to-slate-100 dark:text-slate-950">
                <MousePointer2 className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                    <Puzzle className="h-3.5 w-3.5" />
                    Story Cloze
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-500/[0.12] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/[0.18] dark:text-amber-100">
                    <Sparkles className="h-3.5 w-3.5" />
                    Drag & Drop
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                    Khu trò chơi kéo thả
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Chọn một màn Story Cloze, kéo từ vào đúng ô trống và xử lý
                    từng câu chuyện như một mini puzzle thay vì một danh sách
                    link trống trải.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-[22px] border border-black/[0.06] bg-white/82 px-4 py-3 dark:border-white/10 dark:bg-white/[0.05]"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl ${stat.tone}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <PracticeToolbar
          query={query}
          activeTopic={activeTopic}
          topics={topics}
          resultLabel={resultLabel}
          onQueryChange={setQuery}
          onTopicChange={setActiveTopic}
        />

        {games.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-black/[0.08] bg-white/74 px-6 py-10 text-center shadow-[0_28px_70px_-52px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-slate-950/74 dark:shadow-[0_28px_70px_-52px_rgba(2,6,23,0.9)]">
            <p className="text-lg font-semibold text-slate-950 dark:text-white">
              Chưa có màn Story Cloze nào đang mở.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Khi admin kích hoạt game, khu vực này sẽ tự động hiển thị lobby
              để learner vào chơi.
            </p>
          </div>
        ) : null}

        {games.length > 0 && filteredGames.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-black/[0.08] bg-white/74 px-6 py-10 text-center shadow-[0_28px_70px_-52px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-slate-950/74 dark:shadow-[0_28px_70px_-52px_rgba(2,6,23,0.9)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-black/[0.04] text-slate-500 dark:bg-white/[0.06] dark:text-slate-300">
              <SearchX className="h-6 w-6" />
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Không tìm thấy màn chơi phù hợp.
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Thử đổi từ khóa hoặc trả filter về trạng thái mặc định.
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex rounded-full border border-black/[0.08] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100 dark:hover:bg-white/[0.1]"
              >
                Xóa bộ lọc
              </button>
            ) : null}
          </div>
        ) : null}

        {filteredGames.length > 0 ? (
          <section className="grid gap-6 xl:grid-cols-2">
            {filteredGames.map((game) => (
              <PracticeGameCard key={game.id} game={game} />
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
