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
    <main className="topics-shell min-h-screen px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-14">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12">
        <TopicHero summary={summary} recommendedTopic={recommendedTopic} />

        {error ? (
          <div className="topics-feedback topics-feedback--error" role="alert">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold">Không thể tải danh sách chủ đề.</p>
              <p className="mt-1">
                Vui lòng tải lại trang hoặc quay lại sau ít phút.
              </p>
            </div>
          </div>
        ) : null}

        <section id="topics-grid" className="scroll-mt-28">
          <div className="topics-catalog-heading">
            <div>
              <p className="topics-eyebrow">Field index / 02</p>
              <h2 className="topics-section-title mt-3 font-[var(--font-display)]">
                Kho chủ đề
              </h2>
            </div>
            <p className="topics-copy max-w-xl text-sm leading-6 sm:text-base sm:leading-7">
              Lọc theo trạng thái hoặc tìm nhanh một chủ đề để bắt đầu đúng chặng.
            </p>
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
            <div className="topics-empty">
              <div className="topics-empty-mark" aria-hidden="true">
                <SearchX />
              </div>
              <div>
                <p className="topics-empty-title">Kho chủ đề đang được chuẩn bị.</p>
                <p className="topics-copy mt-2 text-sm leading-6">
                  Những chặng học đầu tiên sẽ xuất hiện tại đây khi nội dung sẵn sàng.
                </p>
              </div>
            </div>
          ) : null}

          {showEmptyFilters ? (
            <div className="topics-empty">
              <div className="topics-empty-mark" aria-hidden="true">
                <SearchX />
              </div>
              <div className="flex-1">
                <p className="topics-empty-title">Không tìm thấy chủ đề phù hợp.</p>
                <p className="topics-copy mt-2 text-sm leading-6">
                  Thử đổi từ khóa hoặc trở về danh sách đầy đủ.
                </p>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="topics-secondary-action mt-5"
                  >
                    Xóa bộ lọc
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {filteredTopics.length > 0 ? (
            <div className="topics-catalog-grid">
              {filteredTopics.map((topic, index) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  index={index + 1}
                  isRecommended={topic.id === recommendedTopic?.id}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
