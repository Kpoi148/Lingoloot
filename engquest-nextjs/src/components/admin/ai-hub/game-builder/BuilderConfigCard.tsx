"use client";

import type { Dispatch, SetStateAction } from "react";
import { Sparkles } from "lucide-react";
import type { Difficulty, VocabularyItem, CategoryOption } from "./types";

type BuilderConfigCardProps = {
  categories: CategoryOption[];
  topic: string;
  setTopic: Dispatch<SetStateAction<string>>;
  difficulty: Difficulty;
  setDifficulty: Dispatch<SetStateAction<Difficulty>>;
  topicVocabularies: VocabularyItem[];
  sanitizedVocabularyCount: number;
  vocabSearch: string;
  setVocabSearch: Dispatch<SetStateAction<string>>;
  selectedWordIds: string[];
  setSelectedWordIds: Dispatch<SetStateAction<string[]>>;
  filteredVocabularies: VocabularyItem[];
  dataError: string | null;
  generateError: string | null;
  generating: boolean;
  onGenerate: () => void;
};

export default function BuilderConfigCard({
  categories,
  topic,
  setTopic,
  difficulty,
  setDifficulty,
  topicVocabularies,
  sanitizedVocabularyCount,
  vocabSearch,
  setVocabSearch,
  selectedWordIds,
  setSelectedWordIds,
  filteredVocabularies,
  dataError,
  generateError,
  generating,
  onGenerate,
}: BuilderConfigCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Editor
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Topic + Vocabulary
          </h2>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Sparkles className="h-4 w-4" />
          {generating ? "Generating..." : "Generate with AI"}
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Topic
          </label>
          <select
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="">Select a topic</option>
            {categories.map((item) => (
              <option key={item._id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Vocabulary Count
          </label>
          <div className="flex h-11 items-center justify-between rounded-2xl border border-slate-200 px-4 text-sm text-slate-600">
            <span>{topicVocabularies.length} items</span>
            <span className="text-xs text-slate-400">
              {sanitizedVocabularyCount} selected
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value as Difficulty)}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Vocabulary Source
          </label>
          <input
            value={vocabSearch}
            onChange={(event) => setVocabSearch(event.target.value)}
            className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            placeholder="Search vocabulary..."
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{selectedWordIds.length} selected</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSelectedWordIds(filteredVocabularies.map((item) => item._id))
                }
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => setSelectedWordIds([])}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {dataError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {dataError}
          </div>
        )}

        <div className="max-h-64 space-y-2 overflow-auto rounded-2xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
          {!topic && (
            <p className="text-xs text-slate-400">Select a topic to load vocabulary.</p>
          )}
          {topic && filteredVocabularies.length === 0 && (
            <p className="text-xs text-slate-400">No vocabulary found for this topic.</p>
          )}
          {topic &&
            filteredVocabularies.map((item) => {
              const isSelected = selectedWordIds.includes(item._id);
              return (
                <label
                  key={item._id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2 transition ${
                    isSelected
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400"
                      : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {item.word}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.meaning}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      setSelectedWordIds((prev) =>
                        prev.includes(item._id)
                          ? prev.filter((wordId) => wordId !== item._id)
                          : [...prev, item._id]
                      )
                    }
                    className="h-4 w-4"
                  />
                </label>
              );
            })}
        </div>
        <p className="text-xs text-slate-500">
          If no vocabulary is selected, all words in the topic are used.
        </p>
      </div>

      {generateError && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {generateError}
        </div>
      )}
    </div>
  );
}
