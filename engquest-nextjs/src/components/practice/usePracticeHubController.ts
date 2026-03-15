"use client";

import { useDeferredValue, useState } from "react";
import type {
  PracticeGameRecord,
  PracticeSummary,
  PracticeTopicOption,
} from "@/components/practice/types";
import {
  filterPracticeGames,
  getPracticeSummary,
  getPracticeTopicOptions,
} from "@/components/practice/utils";

type UsePracticeHubControllerReturn = {
  query: string;
  activeTopic: string;
  filteredGames: PracticeGameRecord[];
  summary: PracticeSummary;
  topics: PracticeTopicOption[];
  resultLabel: string;
  hasActiveFilters: boolean;
  setQuery: (value: string) => void;
  setActiveTopic: (value: string) => void;
  clearFilters: () => void;
};

export function usePracticeHubController(
  games: PracticeGameRecord[]
): UsePracticeHubControllerReturn {
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("all");
  const deferredQuery = useDeferredValue(query);

  const filteredGames = filterPracticeGames(games, activeTopic, deferredQuery);
  const summary = getPracticeSummary(games);
  const topics = getPracticeTopicOptions(games);
  const hasActiveFilters = query.trim().length > 0 || activeTopic !== "all";
  const resultLabel =
    filteredGames.length === 1
      ? "1 màn chơi phù hợp"
      : `${filteredGames.length} màn chơi phù hợp`;

  return {
    query,
    activeTopic,
    filteredGames,
    summary,
    topics,
    resultLabel,
    hasActiveFilters,
    setQuery,
    setActiveTopic,
    clearFilters: () => {
      setQuery("");
      setActiveTopic("all");
    },
  };
}
