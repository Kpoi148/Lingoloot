"use client";
// Controller hook that manages AI game builder state, generation, and save actions.

import { useActionState, useEffect, useMemo, useState } from "react";
import {
  generateGameWithAi,
  loadDictionaryMeaning,
  loadGameBuilderData,
  saveGameToDatabase,
} from "@/components/admin/ai-hub/game-builder/api";
import { formatIssues, GameSchema } from "@/components/admin/ai-hub/game-builder/schema";
import type {
  CategoryOption,
  Difficulty,
  Game,
  SaveState,
  VocabularyItem,
} from "@/components/admin/ai-hub/game-builder/types";
import {
  filterVocabulariesByKeyword,
  getAnswerSet,
  getPreviewWordBank,
  getTopicVocabularies,
  sanitizeVocabulary,
  selectVocabulariesByIds,
} from "@/components/admin/ai-hub/game-builder/utils";

const INITIAL_SAVE_STATE: SaveState = {
  status: "idle",
  message: "",
};

type SavePayload = {
  game: Game | null;
  topicName: string;
};

export function useGameBuilderController() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [vocabularies, setVocabularies] = useState<VocabularyItem[]>([]);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [vocabSearch, setVocabSearch] = useState("");
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const [rawJson, setRawJson] = useState("");
  const [game, setGame] = useState<Game | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [meaningCache, setMeaningCache] = useState<Record<string, string>>({});
  const [selectedMeaning, setSelectedMeaning] = useState<{
    word: string;
    meaning: string;
  } | null>(null);

  const [saveState, saveAction, isSaving] = useActionState<SaveState, SavePayload>(
    async (_prevState, payload) => {
      if (!payload.topicName.trim()) {
        return {
          status: "error",
          message: "Topic name is required before saving.",
        };
      }
      if (!payload.game) {
        return {
          status: "error",
          message: "Game JSON is invalid or empty.",
        };
      }

      try {
        await saveGameToDatabase(payload.game, payload.topicName);
        return {
          status: "success",
          message: "Game saved with status active.",
        };
      } catch (error) {
        return {
          status: "error",
          message:
            error instanceof Error ? error.message : "Unable to save game.",
        };
      }
    },
    INITIAL_SAVE_STATE
  );

  useEffect(() => {
    let active = true;

    // This function loads categories and vocabulary once so the builder can derive filtered state locally.
    const loadData = async () => {
      setDataError(null);
      try {
        const data = await loadGameBuilderData();

        if (active) {
          const nextCategories = data.categories;
          setCategories(nextCategories);
          setTopic((prev) => prev || nextCategories[0]?.slug || "");
          setVocabularies(data.vocabularies);
        }
      } catch (error) {
        if (active) {
          setDataError(
            error instanceof Error ? error.message : "Unable to load data."
          );
        }
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  const selectedCategory = useMemo(
    () => categories.find((item) => item.slug === topic),
    [categories, topic]
  );

  const topicVocabularies = useMemo(
    () => getTopicVocabularies(topic, selectedCategory, vocabularies),
    [topic, selectedCategory, vocabularies]
  );

  const filteredVocabularies = useMemo(
    () => filterVocabulariesByKeyword(vocabSearch, topicVocabularies),
    [vocabSearch, topicVocabularies]
  );

  const selectedWords = useMemo(
    () => selectVocabulariesByIds(selectedWordIds, vocabularies),
    [selectedWordIds, vocabularies]
  );

  const sanitizedVocabulary = useMemo(
    () => sanitizeVocabulary(selectedWordIds, selectedWords, topicVocabularies),
    [selectedWordIds, selectedWords, topicVocabularies]
  );

  useEffect(() => {
    setSelectedWordIds([]);
    setVocabSearch("");
  }, [topic]);

  const previewWordBank = useMemo(() => getPreviewWordBank(game), [game]);
  const answerSet = useMemo(() => getAnswerSet(game), [game]);

  // This function parses and validates the editable JSON before enabling preview or save.
  const parseJson = (value: string) => {
    if (!value.trim()) {
      setGame(null);
      setJsonError(null);
      return;
    }

    try {
      const parsed = JSON.parse(value) as unknown;
      const validated = GameSchema.safeParse(parsed);
      if (!validated.success) {
        setGame(null);
        setJsonError(formatIssues(validated.error.issues));
        return;
      }

      setGame(validated.data);
      setJsonError(null);
    } catch (error) {
      setGame(null);
      setJsonError(error instanceof Error ? error.message : "Invalid JSON format.");
    }
  };

  const handleJsonChange = (value?: string) => {
    const nextValue = value ?? "";
    setRawJson(nextValue);
    parseJson(nextValue);
  };

  // This function caches dictionary meanings so repeated preview clicks do not refetch the same word.
  const loadMeaning = async (word: string) => {
    const normalized = word.toLowerCase();
    if (meaningCache[normalized]) {
      setSelectedMeaning({ word, meaning: meaningCache[normalized] });
      return;
    }

    try {
      const meaning = await loadDictionaryMeaning(word);
      setMeaningCache((prev) => ({ ...prev, [normalized]: meaning }));
      setSelectedMeaning({ word, meaning });
    } catch {}
  };

  // This function asks AI for a game and validates the result before preview or save.
  const handleGenerate = async () => {
    setGenerateError(null);
    if (!topic.trim()) {
      setGenerateError("Please select a topic.");
      return;
    }
    if (sanitizedVocabulary.length === 0) {
      setGenerateError("No vocabulary available for the selected topic.");
      return;
    }

    setGenerating(true);
    try {
      const gamePayload = await generateGameWithAi({
        topicName: selectedCategory?.name ?? topic.trim(),
        difficulty,
        vocabularyList: sanitizedVocabulary,
      });
      const validated = GameSchema.safeParse(gamePayload);
      if (!validated.success) {
        throw new Error(formatIssues(validated.error.issues));
      }

      const formatted = JSON.stringify(validated.data, null, 2);
      setRawJson(formatted);
      setGame(validated.data);
      setJsonError(null);
    } catch (error) {
      setGenerateError(
        error instanceof Error ? error.message : "Unable to generate game."
      );
    } finally {
      setGenerating(false);
    }
  };

  // This function saves the last validated game payload together with the active topic label.
  const handleSave = () => {
    void saveAction({ game, topicName: selectedCategory?.name ?? topic.trim() });
  };

  return {
    answerSet,
    categories,
    dataError,
    difficulty,
    filteredVocabularies,
    game,
    generateError,
    generating,
    handleGenerate,
    handleJsonChange,
    handleSave,
    isSaving,
    jsonError,
    loadMeaning,
    previewWordBank,
    rawJson,
    saveState,
    sanitizedVocabulary,
    selectedMeaning,
    selectedWordIds,
    setDifficulty,
    setSelectedWordIds,
    setTopic,
    setVocabSearch,
    topic,
    topicVocabularies,
    vocabSearch,
  };
}
