"use client";

import { useDeferredValue, useState } from "react";
import type {
  TopicFilterId,
  TopicFilterOption,
  TopicRecord,
} from "@/components/topics/types";
import {
  TOPIC_FILTERS,
  filterTopics,
  getRecommendedTopic,
  getTopicStatus,
  getTopicSummary,
  isTopicNew,
} from "@/components/topics/utils";

type UseTopicsControllerReturn = {
  query: string;
  activeFilter: TopicFilterId;
  filters: TopicFilterOption[];
  filteredTopics: TopicRecord[];
  recommendedTopic: TopicRecord | null;
  summary: ReturnType<typeof getTopicSummary>;
  resultLabel: string;
  hasActiveFilters: boolean;
  setQuery: (value: string) => void;
  setActiveFilter: (value: TopicFilterId) => void;
  clearFilters: () => void;
};

export function useTopicsController(
  topics: TopicRecord[]
): UseTopicsControllerReturn {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<TopicFilterId>("all");
  const deferredQuery = useDeferredValue(query);

  const filteredTopics = filterTopics(topics, activeFilter, deferredQuery);
  const recommendedTopic = getRecommendedTopic(topics);
  const summary = getTopicSummary(topics);
  const hasActiveFilters = query.trim().length > 0 || activeFilter !== "all";

  const filters: TopicFilterOption[] = TOPIC_FILTERS.map((filter) => {
    switch (filter.id) {
      case "in-progress":
        return {
          ...filter,
          count: topics.filter(
            (topic) => getTopicStatus(topic) === "in-progress"
          ).length,
        };
      case "completed":
        return {
          ...filter,
          count: topics.filter((topic) => getTopicStatus(topic) === "completed")
            .length,
        };
      case "new":
        return {
          ...filter,
          count: topics.filter(isTopicNew).length,
        };
      default:
        return {
          ...filter,
          count: topics.length,
        };
    }
  });

  const resultLabel = `${filteredTopics.length} chủ đề đang hiển thị`;

  return {
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
    clearFilters: () => {
      setQuery("");
      setActiveFilter("all");
    },
  };
}
