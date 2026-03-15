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
import { cn } from "@/lib/shared/utils";
import type { TopicRecord } from "@/components/topics/types";
import {
  getPrimaryTopicAction,
  getSecondaryTopicAction,
  getTopicMilestones,
  getTopicStatus,
  getTopicStatusMeta,
  getTopicTheme,
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
};

export default function TopicCard({ topic }: TopicCardProps) {
  const Icon = iconMap[topic.slug] ?? BookOpen;
  const theme = getTopicTheme(topic.slug);
  const status = getTopicStatus(topic);
  const statusMeta = getTopicStatusMeta(status);
  const milestones = getTopicMilestones(topic.progress);
  const primaryAction = getPrimaryTopicAction(topic);
  const secondaryAction = getSecondaryTopicAction(topic);
  const isFresh = isTopicNew(topic);

  return (
    <article
      className={cn(
        "group relative isolate overflow-hidden rounded-[30px] border bg-white/78 p-6 shadow-[0_36px_90px_-56px_rgba(15,23,42,0.55)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 dark:bg-slate-950/72 dark:shadow-[0_36px_90px_-56px_rgba(2,6,23,0.92)] sm:p-7",
        theme.cardBorderClass
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-8 top-0 h-28 rounded-b-[34px] bg-gradient-to-b opacity-90 blur-2xl transition duration-500 group-hover:scale-110",
          theme.glowClass
        )}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] text-white",
                theme.iconClass
              )}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]",
                    statusMeta.className
                  )}
                >
                  {statusMeta.label}
                </span>
                {isFresh && status !== "new" ? (
                  <span className="inline-flex rounded-full border border-amber-200/80 bg-amber-500/[0.12] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/[0.18] dark:text-amber-100">
                    Mới cập nhật
                  </span>
                ) : null}
              </div>

              <Link
                href={`/learning/${topic.slug}`}
                className="mt-3 block text-2xl font-semibold tracking-[-0.04em] text-slate-950 transition hover:text-slate-700 dark:text-white dark:hover:text-slate-100"
              >
                {topic.name}
              </Link>
            </div>
          </div>

          <span className="inline-flex shrink-0 rounded-full border border-black/[0.08] bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
            {topic.count} từ
          </span>
        </div>

        <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
          {topic.description ?? "Chưa có mô tả cho chủ đề này."}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div
            className={cn(
              "rounded-[22px] border px-4 py-4",
              milestones.vocabDone
                ? theme.softPanelClass
                : "border-black/[0.06] bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04]"
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Bước 1
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
              Flashcards
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {milestones.vocabDone
                ? "Đã học xong phần từ vựng."
                : "Ôn từ vựng trước khi làm quiz."}
            </p>
          </div>

          <div
            className={cn(
              "rounded-[22px] border px-4 py-4",
              milestones.quizDone
                ? theme.softPanelClass
                : "border-black/[0.06] bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04]"
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Bước 2
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
              Quiz
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {milestones.quizDone
                ? "Bạn đã chốt xong topic này."
                : "Hoàn thành quiz để lên 100%."}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            <span>Tiến độ chủ đề</span>
            <span>{topic.progress}%</span>
          </div>
          <div className="h-3 rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
            <div
              className={cn(
                "h-3 rounded-full bg-gradient-to-r transition-all duration-500",
                theme.progressClass
              )}
              style={{ width: `${topic.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={primaryAction.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5",
              theme.buttonClass
            )}
          >
            {primaryAction.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={secondaryAction.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5",
              theme.subtleButtonClass
            )}
          >
            {secondaryAction.label}
          </Link>
        </div>
      </div>
    </article>
  );
}
