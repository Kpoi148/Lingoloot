import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesColumn,
  Sparkles,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/shared/utils";
import type { TopicRecord, TopicSummary } from "@/components/topics/types";
import {
  getPrimaryTopicAction,
  getTopicStatus,
  getTopicStatusMeta,
  getTopicTheme,
  isTopicNew,
} from "@/components/topics/utils";

type TopicHeroProps = {
  summary: TopicSummary;
  recommendedTopic: TopicRecord | null;
};

export default function TopicHero({
  summary,
  recommendedTopic,
}: TopicHeroProps) {
  const recommendedTheme = recommendedTopic
    ? getTopicTheme(recommendedTopic.slug)
    : getTopicTheme("");
  const recommendedStatus = recommendedTopic
    ? getTopicStatusMeta(getTopicStatus(recommendedTopic))
    : null;
  const primaryAction = recommendedTopic
    ? getPrimaryTopicAction(recommendedTopic)
    : null;

  const summaryCards = [
    {
      label: "Đang học",
      value: summary.activeTopics,
      hint: "ưu tiên quay lại trước",
      icon: ChartNoAxesColumn,
      iconClass:
        "bg-violet-500/[0.12] text-violet-700 dark:bg-violet-500/[0.18] dark:text-violet-100",
    },
    {
      label: "Đã chốt xong",
      value: summary.completedTopics,
      hint: "đủ flashcards và quiz",
      icon: Trophy,
      iconClass:
        "bg-emerald-500/[0.12] text-emerald-700 dark:bg-emerald-500/[0.18] dark:text-emerald-100",
    },
    {
      label: "Mới cập nhật",
      value: summary.freshTopics,
      hint: "có nội dung vừa thêm",
      icon: Sparkles,
      iconClass:
        "bg-amber-500/[0.12] text-amber-700 dark:bg-amber-500/[0.18] dark:text-amber-100",
    },
  ];

  return (
    <section className="relative isolate overflow-hidden rounded-[36px] border border-black/[0.08] bg-white/78 px-6 py-7 shadow-[0_40px_120px_-56px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_40px_120px_-56px_rgba(2,6,23,0.9)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.24),transparent_34%),radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.32),transparent)] dark:bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_28%),radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.36),transparent)]"
      />

      <div className="relative z-10 space-y-6">
        <div className="max-w-5xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/72 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5" />
            Learning map
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl">
              Quay lại đúng topic, rồi mới mở thêm.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              Hiện có {summary.totalTopics} chủ đề với {summary.totalWords} từ
              vựng. Trang này ưu tiên các topic đang học để bạn tiếp tục nhanh
              hơn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {recommendedTopic ? (
              <Link
                href={primaryAction?.href ?? `/learning/${recommendedTopic.slug}`}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5",
                  recommendedTheme.buttonClass
                )}
              >
                {primaryAction?.label ?? "Bắt đầu học"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
            <a
              href="#topics-grid"
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/72 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-100 dark:hover:bg-white/[0.08]"
            >
              Xem toàn bộ chủ đề
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-[24px] border border-black/[0.06] bg-white/72 p-4 shadow-[0_22px_48px_-36px_rgba(15,23,42,0.55)] dark:border-white/10 dark:bg-white/[0.05] dark:shadow-[0_22px_48px_-36px_rgba(2,6,23,0.8)]"
                >
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl",
                      card.iconClass
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                    {card.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {card.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {card.hint}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={cn(
            "relative max-w-4xl overflow-hidden rounded-[30px] border bg-white/80 p-6 shadow-[0_34px_90px_-48px_rgba(15,23,42,0.55)] dark:bg-slate-950/80 dark:shadow-[0_34px_90px_-48px_rgba(2,6,23,0.92)]",
            recommendedTheme.cardBorderClass
          )}
        >
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-x-6 top-0 h-28 rounded-b-[32px] bg-gradient-to-b opacity-90 blur-2xl",
              recommendedTheme.glowClass
            )}
          />

          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Học tiếp
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">
                  {recommendedTopic?.name ?? "Kho chủ đề đang chờ bạn lấp đầy"}
                </h2>
              </div>

              {recommendedTopic ? (
                <span
                  className={cn(
                    "inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
                    recommendedStatus?.className
                  )}
                >
                  {recommendedStatus?.label}
                </span>
              ) : null}
            </div>

            <p
              className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {recommendedTopic?.description
                ? recommendedTopic.description
                : "Khi dữ liệu chủ đề xuất hiện, khu vực này sẽ gợi ý chặng phù hợp nhất để bạn quay lại đúng flow học tập."}
            </p>

            {recommendedTopic ? (
              <>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full border border-black/[0.08] bg-white/72 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                    {recommendedTheme.accentLabel}
                  </span>
                  <span className="inline-flex rounded-full border border-black/[0.08] bg-white/72 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                    {recommendedTopic.count} từ vựng
                  </span>
                  <span className="inline-flex rounded-full border border-black/[0.08] bg-white/72 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                    Tiến độ {recommendedTopic.progress}%
                  </span>
                  {isTopicNew(recommendedTopic) ? (
                    <span className="inline-flex rounded-full border border-amber-200/80 bg-amber-500/[0.12] px-3 py-1 text-xs font-semibold text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/[0.18] dark:text-amber-100">
                      Mới cập nhật
                    </span>
                  ) : null}
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    <span>Tiến độ hiện tại</span>
                    <span>{recommendedTopic.progress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
                    <div
                      className={cn(
                        "h-3 rounded-full bg-gradient-to-r transition-all duration-500",
                        recommendedTheme.progressClass
                      )}
                      style={{ width: `${recommendedTopic.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  {primaryAction ? (
                    <Link
                      href={primaryAction.href}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5",
                        recommendedTheme.buttonClass
                      )}
                    >
                      {primaryAction.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="mt-8 rounded-[22px] border border-dashed border-black/[0.08] bg-black/[0.03] px-5 py-6 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Chưa có topic nào để gợi ý.
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Khi collection `categories` có dữ liệu, trang này sẽ tự động
                  hiển thị roadmap, trạng thái và lối vào học tập phù hợp.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
