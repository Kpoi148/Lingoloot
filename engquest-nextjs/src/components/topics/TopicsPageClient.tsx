"use client";

import { AlertCircle, SearchX } from "lucide-react";
import TopicCard from "@/components/topics/TopicCard";
import TopicHero from "@/components/topics/TopicHero";
import TopicsToolbar from "@/components/topics/TopicsToolbar";
import type { TopicRecord } from "@/components/topics/types";
import { useTopicsController } from "@/components/topics/useTopicsController";

type TopicsPageClientProps = {
  topics: TopicRecord[];
  error?: string | null;
};

export function TopicsPageClient({
  topics,
  error,
}: TopicsPageClientProps) {
  const {
    query,
    activeFilter,
    filters,
    filteredTopics,
    recommendedTopic,
    summary,
    resultLabel,
    hasActiveFilters,
    setQuery,
    setActiveFilter,
    clearFilters,
  } = useTopicsController(topics);

  const showEmptyData = topics.length === 0 && !error;
  const showEmptyFilters = filteredTopics.length === 0 && topics.length > 0;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-16 pt-8 text-content sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[460px] bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(96,165,250,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.88))] dark:bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(96,165,250,0.16),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.92))]"
      />
      <div
        aria-hidden="true"
        className="absolute left-[-6rem] top-[18rem] -z-10 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-500/10"
      />
      <div
        aria-hidden="true"
        className="absolute right-[-4rem] top-[28rem] -z-10 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <TopicHero summary={summary} recommendedTopic={recommendedTopic} />

        {error ? (
          <div className="flex items-start gap-3 rounded-[24px] border border-red-200/80 bg-red-50/90 px-5 py-4 text-sm text-red-700 shadow-sm dark:border-red-500/20 dark:bg-red-950/50 dark:text-red-200">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Không thể tải danh sách chủ đề.</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        ) : null}

        <section id="topics-grid" className="scroll-mt-28 space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              Topic catalog
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
              Danh sách chủ đề
            </h2>
          </div>

          <TopicsToolbar
            query={query}
            activeFilter={activeFilter}
            resultLabel={resultLabel}
            filters={filters}
            onQueryChange={setQuery}
            onFilterChange={setActiveFilter}
          />

          {showEmptyData ? (
            <div className="rounded-[30px] border border-dashed border-black/[0.08] bg-white/72 px-6 py-10 text-center shadow-[0_28px_70px_-50px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-slate-950/72 dark:shadow-[0_28px_70px_-50px_rgba(2,6,23,0.9)]">
              <p className="text-lg font-semibold text-slate-950 dark:text-white">
                Chưa có chủ đề nào trong hệ thống.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                Hãy thêm dữ liệu vào collection `categories` để learner có thể
                bắt đầu học theo topic.
              </p>
            </div>
          ) : null}

          {showEmptyFilters ? (
            <div className="rounded-[30px] border border-dashed border-black/[0.08] bg-white/72 px-6 py-10 text-center shadow-[0_28px_70px_-50px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-slate-950/72 dark:shadow-[0_28px_70px_-50px_rgba(2,6,23,0.9)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-black/[0.04] text-slate-500 dark:bg-white/[0.06] dark:text-slate-300">
                <SearchX className="h-6 w-6" />
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
                Không tìm thấy chủ đề phù hợp.
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                Thử đổi từ khóa tìm kiếm hoặc trả filter về trạng thái mặc định.
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

          {filteredTopics.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
