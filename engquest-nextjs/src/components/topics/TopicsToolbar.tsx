"use client";

import { Search } from "lucide-react";
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
    <div className="topics-toolbar">
      <div className="topics-toolbar-main">
        <label className="topics-search">
          <span className="sr-only">Tìm chủ đề</span>
          <Search aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Tìm chủ đề hoặc nội dung..."
          />
        </label>

        <div
          className="topics-filter-tabs"
          role="group"
          aria-label="Lọc danh sách chủ đề"
        >
          {filters.map((filter) => {
            const active = filter.id === activeFilter;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onFilterChange(filter.id)}
                className="topics-filter-tab"
                data-active={active}
                aria-pressed={active}
                title={filter.hint}
              >
                <span>{filter.label}</span>
                <span className="topics-filter-count">{filter.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="topics-result-label" aria-live="polite">
        {resultLabel}
      </p>
    </div>
  );
}
