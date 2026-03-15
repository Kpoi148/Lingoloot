"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/shared/utils";
import type {
  TopicFilterId,
  TopicFilterOption,
} from "@/components/topics/types";

type TopicsToolbarProps = {
  query: string;
  activeFilter: TopicFilterId;
  resultLabel: string;
  filters: TopicFilterOption[];
  onQueryChange: (value: string) => void;
  onFilterChange: (value: TopicFilterId) => void;
};

export default function TopicsToolbar({
  query,
  activeFilter,
  resultLabel,
  filters,
  onQueryChange,
  onFilterChange,
}: TopicsToolbarProps) {
  return (
    <div className="rounded-[28px] border border-black/[0.08] bg-white/75 p-4 shadow-[0_28px_70px_-50px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/72 dark:shadow-[0_28px_70px_-50px_rgba(2,6,23,0.9)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Tìm theo tên chủ đề hoặc mô tả..."
            className="h-12 w-full rounded-2xl border border-black/[0.08] bg-white/80 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-400/40 dark:focus:bg-white/[0.08]"
          />
        </label>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          {resultLabel}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const active = filter.id === activeFilter;

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
                active
                  ? "border-sky-300 bg-sky-500/[0.12] text-sky-800 dark:border-sky-400/40 dark:bg-sky-500/[0.16] dark:text-sky-100"
                  : "border-black/[0.08] bg-white/78 text-slate-700 hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:bg-white/[0.08]"
              )}
              aria-pressed={active}
              title={filter.hint}
            >
              <span>{filter.label}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  active
                    ? "bg-white/70 text-sky-700 dark:bg-slate-950/50 dark:text-sky-100"
                    : "bg-black/[0.04] text-slate-500 dark:bg-white/[0.06] dark:text-slate-400"
                )}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
