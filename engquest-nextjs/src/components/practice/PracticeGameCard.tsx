import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Grip,
  Hourglass,
  Puzzle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/shared/utils";
import type { PracticeGameRecord } from "@/components/practice/types";
import {
  formatPracticeDate,
  getPracticeTheme,
  isPracticeFresh,
} from "@/components/practice/utils";

type PracticeGameCardProps = {
  game: PracticeGameRecord;
};

function renderPreview(preview: string) {
  return preview.split("____").flatMap((segment, index, parts) => {
    const content = [
      <span key={`segment-${index}`}>{segment}</span>,
    ];

    if (index < parts.length - 1) {
      content.push(
        <span
          key={`gap-${index}`}
          className="mx-1 inline-flex min-w-[4.75rem] items-center justify-center rounded-xl border border-dashed border-current/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]"
        >
          Drop
        </span>
      );
    }

    return content;
  });
}

export default function PracticeGameCard({ game }: PracticeGameCardProps) {
  const theme = getPracticeTheme(game.topicName);
  const isFresh = isPracticeFresh(game);

  return (
    <article
      className={cn(
        "group relative isolate overflow-hidden rounded-[30px] border bg-white/80 p-6 shadow-[0_34px_90px_-54px_rgba(15,23,42,0.52)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 dark:bg-slate-950/74 dark:shadow-[0_34px_90px_-54px_rgba(2,6,23,0.9)] sm:p-7",
        theme.cardBorderClass
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-8 top-0 h-28 rounded-b-[36px] bg-gradient-to-b opacity-90 blur-2xl transition duration-500 group-hover:scale-110",
          theme.glowClass
        )}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px]",
                theme.iconClass
              )}
            >
              <Puzzle className="h-6 w-6" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
                    theme.badgeClass
                  )}
                >
                  <Grip className="h-3.5 w-3.5" />
                  Kéo thả
                </span>
                {isFresh ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-rose-200/80 bg-rose-500/[0.1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-rose-800 dark:border-rose-400/18 dark:bg-rose-500/[0.16] dark:text-rose-100">
                    <Sparkles className="h-3.5 w-3.5" />
                    Mới
                  </span>
                ) : null}
              </div>

              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                {game.topicName}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                {game.title}
              </h2>
            </div>
          </div>

          <span className="hidden rounded-full border border-black/[0.08] bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 sm:inline-flex">
            {formatPracticeDate(game.createdAt)}
          </span>
        </div>

        <div
          className={cn(
            "mt-6 rounded-[24px] border px-4 py-4 text-sm leading-7 text-slate-700 dark:text-slate-100",
            theme.previewClass
          )}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Preview
          </p>
          <div className="mt-3 font-medium">{renderPreview(game.preview)}</div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
            <Grip className="h-3.5 w-3.5" />
            {game.gapCount} ô trống
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
            <Puzzle className="h-3.5 w-3.5" />
            {game.distractorCount} từ gây nhiễu
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
            <Hourglass className="h-3.5 w-3.5" />
            {game.estimatedMinutes} phút
          </span>
          {game.createdAt ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 sm:hidden">
              <CalendarClock className="h-3.5 w-3.5" />
              {formatPracticeDate(game.createdAt)}
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/learn/practice/${game.id}`}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5",
              theme.buttonClass
            )}
          >
            Vào chơi
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/learn/practice/${game.id}`}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5",
              theme.buttonGhostClass
            )}
          >
            Xem màn chơi
          </Link>
        </div>
      </div>
    </article>
  );
}
