"use client";

// Controller hook that coordinates Story Cloze state, drag-drop, scoring, and meaning lookup.
import {
  MouseSensor,
  TouchSensor,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import confetti from "canvas-confetti";
import { useMemo, useState } from "react";
import { loadStoryClozeMeaning } from "@/components/game/story-cloze/api";
import type {
  StoryClozeFeedback,
  StoryClozeGameData,
  StoryClozeMeaningSelection,
  StoryClozeStatus,
} from "@/components/game/story-cloze/types";
import {
  buildFilledItemsMap,
  buildStoryClozeBankItems,
  getStoryClozeAnswerSet,
  getStoryClozeGaps,
  getWrongGapIds,
} from "@/components/game/story-cloze/utils";

export function useStoryClozeGameController(initialGame: StoryClozeGameData) {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<StoryClozeStatus>("playing");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<StoryClozeFeedback>(null);
  const [wrongGaps, setWrongGaps] = useState<string[]>([]);
  const [meaningCache, setMeaningCache] = useState<Record<string, string>>({});
  const [selectedMeaning, setSelectedMeaning] =
    useState<StoryClozeMeaningSelection | null>(null);
  const [bankSeed] = useState(() => Math.random());
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 5 },
    })
  );

  const gaps = useMemo(
    () => getStoryClozeGaps(initialGame.content),
    [initialGame.content]
  );

  const answerSet = useMemo(() => getStoryClozeAnswerSet(gaps), [gaps]);

  const bankItems = useMemo(
    () =>
      buildStoryClozeBankItems(gaps, initialGame.distractors, bankSeed),
    [bankSeed, gaps, initialGame.distractors]
  );

  const usedIds = useMemo(
    () => new Set(Object.values(userAnswers)),
    [userAnswers]
  );

  const availableItems = useMemo(
    () => bankItems.filter((item) => !usedIds.has(item.id)),
    [bankItems, usedIds]
  );

  const filledItems = useMemo(() => buildFilledItemsMap(bankItems), [bankItems]);

  const activeItem = useMemo(
    () => (activeId ? filledItems.get(activeId) ?? null : null),
    [activeId, filledItems]
  );

  const answeredCount = Object.keys(userAnswers).length;
  const progress = gaps.length
    ? Math.round((answeredCount / gaps.length) * 100)
    : 0;

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id.toString());
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over || !over.id.toString().startsWith("gap-")) {
      return;
    }

    const gapId = over.id.toString();
    setStatus("playing");
    setFeedback(null);
    setWrongGaps([]);

    setUserAnswers((prev) => {
      const next = { ...prev };
      const existingGap = Object.entries(next).find(
        ([, value]) => value === active.id.toString()
      );

      if (existingGap) {
        delete next[existingGap[0]];
      }

      next[gapId] = active.id.toString();
      return next;
    });
  };

  const handleCheck = () => {
    if (!gaps.length) return;

    setStatus("checking");
    const wrong = getWrongGapIds(gaps, userAnswers, filledItems);

    if (wrong.length === 0) {
      setStatus("completed");
      setScore(gaps.length);
      setFeedback("correct");
      setWrongGaps([]);
      if (typeof window !== "undefined") {
        confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
      }
      return;
    }

    setScore(gaps.length - wrong.length);
    setWrongGaps(wrong);
    setFeedback("wrong");
  };

  const handleRetryWrong = () => {
    if (wrongGaps.length === 0) return;

    setUserAnswers((prev) => {
      const next = { ...prev };
      wrongGaps.forEach((gapId) => {
        delete next[gapId];
      });
      return next;
    });
    setStatus("playing");
    setFeedback(null);
    setWrongGaps([]);
  };

  const handleClearGap = (gapId: string) => {
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[gapId];
      return next;
    });
  };

  const loadMeaning = async (word: string) => {
    const normalizedWord = word.toLowerCase();
    if (meaningCache[normalizedWord]) {
      setSelectedMeaning({
        word,
        meaning: meaningCache[normalizedWord],
      });
      return;
    }

    try {
      const meaning = await loadStoryClozeMeaning(word);
      setMeaningCache((prev) => ({ ...prev, [normalizedWord]: meaning }));
      setSelectedMeaning({ word, meaning });
    } catch {}
  };

  const resetGame = () => {
    setUserAnswers({});
    setStatus("playing");
    setScore(0);
    setFeedback(null);
    setWrongGaps([]);
    setSelectedMeaning(null);
  };

  return {
    activeItem,
    answerSet,
    answeredCount,
    availableItems,
    feedback,
    filledItems,
    gaps,
    handleCheck,
    handleClearGap,
    handleDragEnd,
    handleDragStart,
    handleRetryWrong,
    loadMeaning,
    progress,
    resetGame,
    score,
    selectedMeaning,
    sensors,
    setActiveId,
    status,
    userAnswers,
    wrongGaps,
  };
}
