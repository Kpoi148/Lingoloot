import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarDays,
  Globe2,
  Headphones,
  PenTool,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { TopicRecord } from "@/components/topics/types";
import {
  getPrimaryTopicAction,
  getTopicMilestones,
  getTopicStatus,
  getTopicStatusMeta,
  getTopicTrackLabel,
  isTopicNew,
} from "@/components/topics/utils";

const iconMap: Record<string, LucideIcon> = {
  "giao-thong": Globe2,
  "cong-so": PenTool,
  "am-thuc": Sparkles,
  "hoc-thuat": BookOpen,
  "ngu-phap": Brain,
  "luyen-nghe": Headphones,
  "ngay-thang-mua": CalendarDays,
};

type TopicCardProps = {
  topic: TopicRecord;
  index: number;
  isRecommended?: boolean;
};

export default function TopicCard({
  topic,
  index,
  isRecommended = false,
}: TopicCardProps) {
  const Icon = iconMap[topic.slug] ?? BookOpen;
  const status = getTopicStatus(topic);
  const statusMeta = getTopicStatusMeta(status);
  const milestones = getTopicMilestones(topic.progress);
  const primaryAction = getPrimaryTopicAction(topic);
  const isFresh = isTopicNew(topic);

  return (
    <article
      className="topics-card"
      data-status={status}
      data-recommended={isRecommended}
    >
      <div className="topics-card-rail" aria-hidden="true">
        <span className="topics-card-index">
          {String(index).padStart(2, "0")}
        </span>
        <span className="topics-card-rail-line" />
        <span className="topics-card-icon">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="topics-card-track">{getTopicTrackLabel(topic.slug)}</p>
          <span className="topics-card-status">
            <span aria-hidden="true" />
            {statusMeta.label}
          </span>
        </div>

        <Link
          href={`/learning/${topic.slug}`}
          className="topics-card-title mt-3 block font-[var(--font-display)]"
        >
          {topic.name}
        </Link>

        {topic.description ? (
          <p className="topics-card-description mt-3">{topic.description}</p>
        ) : (
          <p className="topics-card-description mt-3">
            Mở chặng học để xem bộ từ vựng và các hoạt động đang có.
          </p>
        )}

        <div className="topics-card-meta mt-4">
          <span>{topic.count} từ vựng</span>
          <span aria-hidden="true">/</span>
          <span>{topic.progress}% hoàn thành</span>
          {isFresh && status !== "new" ? (
            <>
              <span aria-hidden="true">/</span>
              <span className="topics-accent-text">Nội dung mới</span>
            </>
          ) : null}
        </div>

        <div className="topics-stage-grid mt-6" aria-label="Các chặng của chủ đề">
          <div className="topics-stage" data-complete={milestones.vocabDone}>
            <span className="topics-stage-bar" aria-hidden="true" />
            <span className="topics-stage-name">Flashcards</span>
            <span className="topics-stage-state">
              {milestones.vocabDone ? "Hoàn tất" : "Chưa xong"}
            </span>
          </div>
          <div className="topics-stage" data-complete={milestones.quizDone}>
            <span className="topics-stage-bar" aria-hidden="true" />
            <span className="topics-stage-name">Quiz</span>
            <span className="topics-stage-state">
              {milestones.quizDone ? "Hoàn tất" : "Đang khóa"}
            </span>
          </div>
        </div>

        <div className="topics-card-footer mt-6">
          <span className="topics-card-note">
            {isRecommended ? "Chặng ưu tiên hiện tại" : `Field note ${String(index).padStart(2, "0")}`}
          </span>
          <Link href={primaryAction.href} className="topics-card-action">
            {primaryAction.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
