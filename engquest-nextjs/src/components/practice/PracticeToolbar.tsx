"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/shared/utils";
import type { PracticeTopicOption } from "@/components/practice/types";

type PracticeToolbarProps = {
  query: string;
  activeTopic: string;
  topics: PracticeTopicOption[];
  resultLabel: string;
  onQueryChange: (value: string) => void;
  onTopicChange: (value: string) => void;
};

export default function PracticeToolbar({
  query,
  activeTopic,
  topics,
  resultLabel,
  onQueryChange,
  onTopicChange,
}: PracticeToolbarProps) {
  return (
    <div className="rounded-[28px] border border-black/[0.08] bg-white/78 p-4 shadow-[0_28px_70px_-52px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/74 dark:shadow-[0_28px_70px_-52px_rgba(2,6,23,0.9)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Tìm theo tên game hoặc chủ đề..."
            className="h-12 w-full rounded-2xl border border-black/[0.08] bg-white/85 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-400/40 dark:focus:bg-white/[0.08]"
          />
        </label>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          {resultLabel}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {topics.map((topic) => {
          const active = topic.id === activeTopic;

          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onTopicChange(topic.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
                active
                  ? "border-amber-300 bg-amber-500/[0.12] text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/[0.16] dark:text-amber-100"
                  : "border-black/[0.08] bg-white/82 text-slate-700 hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:bg-white/[0.08]"
              )}
              aria-pressed={active}
            >
              <span>{topic.label}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  active
                    ? "bg-white/75 text-amber-800 dark:bg-slate-950/45 dark:text-amber-100"
                    : "bg-black/[0.04] text-slate-500 dark:bg-white/[0.06] dark:text-slate-400"
                )}
              >
                {topic.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
