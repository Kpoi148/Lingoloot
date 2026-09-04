import Link from "next/link";
import { ArrowRight, Compass, Route } from "lucide-react";
import type { TopicRecord, TopicSummary } from "@/components/topics/types";
import {
  getPrimaryTopicAction,
  getTopicStatus,
  getTopicStatusMeta,
  getTopicTrackLabel,
  isTopicNew,
} from "@/components/topics/utils";

type TopicHeroProps = {
  summary: TopicSummary;
  recommendedTopic: TopicRecord | null;
};

const numberFormatter = new Intl.NumberFormat("vi-VN");

export default function TopicHero({
  summary,
  recommendedTopic,
}: TopicHeroProps) {
  const recommendedStatus = recommendedTopic
    ? getTopicStatus(recommendedTopic)
    : "not-started";
  const recommendedStatusMeta = recommendedTopic
    ? getTopicStatusMeta(recommendedStatus)
    : null;
  const primaryAction = recommendedTopic
    ? getPrimaryTopicAction(recommendedTopic)
    : null;
  const progress = recommendedTopic
    ? Math.min(100, Math.max(0, recommendedTopic.progress))
    : 0;

  const summaryItems = [
    {
      label: "Đang học",
      value: summary.activeTopics,
      hint: "chặng cần tiếp tục",
    },
    {
      label: "Hoàn thành",
      value: summary.completedTopics,
      hint: "đã qua flashcards và quiz",
    },
    {
      label: "Kho từ vựng",
      value: numberFormatter.format(summary.totalWords),
      hint: "từ trong toàn bộ lộ trình",
    },
  ];

  return (
    <section className="topics-hero">
      <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.72fr)] lg:gap-12">
        <header className="max-w-3xl">
          <p className="topics-eyebrow">
            <Route className="h-4 w-4" aria-hidden="true" />
            Learning map / {summary.totalTopics} tracks
          </p>

          <h1 className="topics-page-title mt-6 font-[var(--font-display)]">
            Chọn chặng học tiếp theo.
          </h1>

          <p className="topics-copy mt-5 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8">
            Quay lại đúng phần đang học hoặc mở một chủ đề mới. Mỗi chặng dẫn bạn
            qua flashcards, quiz và phần thưởng trong cùng một nhịp học.
          </p>

          {summary.freshTopics > 0 ? (
            <p className="topics-update-note mt-5">
              <span aria-hidden="true" />
              {summary.freshTopics} chặng vừa có nội dung mới
            </p>
          ) : null}
        </header>

        <aside
          className="topics-resume"
          data-status={recommendedStatus}
          aria-label="Chặng học được đề xuất"
        >
          {recommendedTopic ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <p className="topics-resume-kicker">Học tiếp / ưu tiên 01</p>
                <span className="topics-resume-status">
                  {recommendedStatusMeta?.label}
                </span>
              </div>

              <p className="topics-resume-track mt-8">
                {getTopicTrackLabel(recommendedTopic.slug)}
              </p>
              <h2 className="topics-resume-title mt-2 font-[var(--font-display)]">
                {recommendedTopic.name}
              </h2>

              {recommendedTopic.description ? (
                <p className="topics-resume-copy mt-3">
                  {recommendedTopic.description}
                </p>
              ) : null}

              <div className="topics-resume-meta mt-5">
                <span>{recommendedTopic.count} từ vựng</span>
                <span aria-hidden="true">/</span>
                <span>{progress}% hoàn thành</span>
                {isTopicNew(recommendedTopic) ? (
                  <>
                    <span aria-hidden="true">/</span>
                    <span>Nội dung mới</span>
                  </>
                ) : null}
              </div>

              <div
                className="topics-mission-route mt-7"
                role="progressbar"
                aria-label={`Tiến độ ${recommendedTopic.name}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div className="topics-mission-line">
                  <span style={{ width: `${progress}%` }} />
                  <i data-reached="true" />
                  <i data-reached={progress >= 50} />
                  <i data-reached={progress >= 100} />
                </div>
                <div className="topics-mission-labels" aria-hidden="true">
                  <span>Bắt đầu</span>
                  <span>Flashcards</span>
                  <span>Quiz</span>
                </div>
              </div>

              {primaryAction ? (
                <Link href={primaryAction.href} className="topics-resume-action mt-7">
                  {primaryAction.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : null}
            </>
          ) : (
            <div className="topics-resume-empty">
              <Compass className="h-7 w-7" aria-hidden="true" />
              <p className="topics-resume-kicker mt-6">Học tiếp</p>
              <h2 className="topics-resume-title mt-2 font-[var(--font-display)]">
                Chưa có chặng được mở.
              </h2>
              <p className="topics-resume-copy mt-3">
                Các chủ đề mới sẽ xuất hiện tại đây khi kho học liệu sẵn sàng.
              </p>
            </div>
          )}
        </aside>
      </div>

      <dl className="topics-summary-strip mt-10 grid sm:grid-cols-3">
        {summaryItems.map((item) => (
          <div key={item.label} className="topics-summary-item">
            <dt className="topics-summary-label">{item.label}</dt>
            <dd className="topics-summary-value mt-2 tabular-nums">{item.value}</dd>
            <dd className="topics-summary-hint mt-1">{item.hint}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
