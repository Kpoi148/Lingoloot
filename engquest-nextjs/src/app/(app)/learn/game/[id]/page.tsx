"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";

type ContentItem = {
  text: string;
  type: "text" | "gap";
  answer?: string;
};

type Game = {
  title: string;
  content: ContentItem[];
  distractors: string[];
};

type DragItem = {
  id: string;
  value: string;
};

export default function LearnGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [gameId, setGameId] = useState<string | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<Record<number, string>>({});
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [meaningCache, setMeaningCache] = useState<Record<string, string>>({});
  const [selectedMeaning, setSelectedMeaning] = useState<{
    word: string;
    meaning: string;
  } | null>(null);
  const [meaningsLoading, setMeaningsLoading] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let active = true;
    const resolveParams = async () => {
      const { id } = await params;
      if (active) {
        setGameId(id);
      }
    };
    resolveParams();
    return () => {
      active = false;
    };
  }, [params]);

  useEffect(() => {
    if (!gameId) return;
    let active = true;

    const loadGame = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/games/${gameId}`, {
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          data?: Game;
          message?: string;
        };
        if (!response.ok) {
          throw new Error(payload.message ?? "Unable to load game.");
        }

        const gameData = payload.data ?? (payload as unknown as Game);
        if (active) {
          setGame(gameData);
          setAssigned({});
          setShakeIndex(null);
          setMeaningCache({});
          setSelectedMeaning(null);
          setMeaningsLoading(false);
        }
      } catch (fetchError) {
        if (active) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load game."
          );
          setGame(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadGame();

    return () => {
      active = false;
    };
  }, [gameId]);

  const dragItems = useMemo<DragItem[]>(() => {
    if (!game) return [];
    const answers = game.content
      .map((item, index) => {
        if (item.type !== "gap") return null;
        const answer = item.answer ?? item.text;
        if (!answer) return null;
        return { id: `answer-${index}`, value: answer };
      })
      .filter(Boolean) as DragItem[];
    const distractors = game.distractors.map((value, index) => ({
      id: `distractor-${index}`,
      value,
    }));
    return [...answers, ...distractors];
  }, [game]);

  const expectedAnswers = useMemo(() => {
    const map = new Map<number, string>();
    if (!game) return map;
    game.content.forEach((item, index) => {
      if (item.type === "gap") {
        const answer = item.answer ?? item.text ?? "";
        if (answer) {
          map.set(index, answer);
        }
      }
    });
    return map;
  }, [game]);

  const totalGaps = expectedAnswers.size;
  const completedGaps = Object.keys(assigned).length;
  const isCompleted = totalGaps > 0 && completedGaps >= totalGaps;

  const assignedIds = useMemo(
    () => new Set(Object.values(assigned)),
    [assigned]
  );

  const availableItems = useMemo(
    () => dragItems.filter((item) => !assignedIds.has(item.id)),
    [assignedIds, dragItems]
  );

  const answerSet = useMemo(() => {
    const set = new Set<string>();
    expectedAnswers.forEach((value) => {
      if (value) {
        set.add(value.toLowerCase());
      }
    });
    return set;
  }, [expectedAnswers]);

  const splitIntoTokens = (text: string) => {
    const tokens: Array<{ value: string; isWord: boolean }> = [];
    const pattern = /[A-Za-z]+(?:['-][A-Za-z]+)*/g;
    let lastIndex = 0;
    let match = pattern.exec(text);
    while (match) {
      if (match.index > lastIndex) {
        tokens.push({
          value: text.slice(lastIndex, match.index),
          isWord: false,
        });
      }
      tokens.push({ value: match[0], isWord: true });
      lastIndex = match.index + match[0].length;
      match = pattern.exec(text);
    }
    if (lastIndex < text.length) {
      tokens.push({ value: text.slice(lastIndex), isWord: false });
    }
    return tokens;
  };

  const loadMeaning = async (word: string) => {
    const normalized = word.toLowerCase();
    if (meaningCache[normalized]) {
      setSelectedMeaning({ word, meaning: meaningCache[normalized] });
      return;
    }

    try {
      const response = await fetch(
        `/api/dictionary/meaning?word=${encodeURIComponent(word)}`,
        { cache: "no-store" }
      );
      const payload = (await response.json()) as {
        data?: { word?: string; meaning?: string };
        message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to fetch meaning.");
      }

      const meaning = payload.data?.meaning?.trim() ?? "";
      if (!meaning) {
        throw new Error("Meaning not found.");
      }

      setMeaningCache((prev) => ({ ...prev, [normalized]: meaning }));
      setSelectedMeaning({ word, meaning });
    } catch {
      // Ignore lookup errors in the learner UI.
    }
  };

  const storyWords = useMemo(() => {
    if (!game) return [];
    const seen = new Set<string>();
    const words: string[] = [];
    game.content.forEach((item) => {
      if (item.type !== "text") return;
      splitIntoTokens(item.text).forEach((token) => {
        if (!token.isWord) return;
        const normalized = token.value.toLowerCase();
        if (!normalized || answerSet.has(normalized)) return;
        if (!seen.has(normalized)) {
          seen.add(normalized);
          words.push(token.value);
        }
      });
    });
    return words;
  }, [game, answerSet]);

  useEffect(() => {
    if (!isCompleted || storyWords.length === 0) return;
    let active = true;

    const loadAllMeanings = async () => {
      const missing = storyWords.filter(
        (word) => !meaningCache[word.toLowerCase()]
      );
      if (missing.length === 0) return;

      setMeaningsLoading(true);
      try {
        await Promise.all(
          missing.map(async (word) => {
            const response = await fetch(
              `/api/dictionary/meaning?word=${encodeURIComponent(word)}`,
              { cache: "no-store" }
            );
            if (!response.ok) return;
            const payload = (await response.json()) as {
              data?: { word?: string; meaning?: string };
            };
            const meaning = payload.data?.meaning?.trim() ?? "";
            if (!meaning) return;
            if (!active) return;
            setMeaningCache((prev) => ({
              ...prev,
              [word.toLowerCase()]: meaning,
            }));
          })
        );
      } finally {
        if (active) {
          setMeaningsLoading(false);
        }
      }
    };

    void loadAllMeanings();

    return () => {
      active = false;
    };
  }, [isCompleted, storyWords, meaningCache]);

  const playCorrectSound = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioContextCtor =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextCtor) return;
      const ctx = audioCtxRef.current ?? new AudioContextCtor();
      audioCtxRef.current = ctx;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 760;
      gain.gain.value = 0.08;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.18);
    } catch {
      // Ignore autoplay or audio errors.
    }
  };

  const handleDrop = (gapIndex: number, itemId: string) => {
    if (assigned[gapIndex]) return;
    if (assignedIds.has(itemId)) return;
    const item = dragItems.find((candidate) => candidate.id === itemId);
    if (!item) return;
    const expected = expectedAnswers.get(gapIndex);
    if (!expected) return;

    if (item.value === expected) {
      setAssigned((prev) => ({ ...prev, [gapIndex]: itemId }));
      playCorrectSound();
      return;
    }

    setShakeIndex(gapIndex);
    setTimeout(() => setShakeIndex(null), 350);
  };

  const handleDragStart = (
    event: DragEvent<HTMLButtonElement>,
    itemId: string
  ) => {
    event.dataTransfer.setData("text/plain", itemId);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: DragEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDropEvent = (
    event: DragEvent<HTMLSpanElement>,
    gapIndex: number
  ) => {
    event.preventDefault();
    const itemId = event.dataTransfer.getData("text/plain");
    if (!itemId) return;
    handleDrop(gapIndex, itemId);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Story Cloze Game
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                {game?.title ?? "Loading game..."}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Drag the words into the correct blanks. Tap a story word to see its meaning.
              </p>
            </div>
            <Link
              href="/"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Back to home
            </Link>
          </div>
        </div>

        {loading && (
          <div className="h-60 animate-pulse rounded-3xl border border-slate-200 bg-white/70" />
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && !game && (
          <div className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-8 text-center text-sm text-slate-500">
            Game data is not available.
          </div>
        )}

        {!loading && !error && game && (
          <div className="rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/70">
            <p className="text-lg leading-8 text-slate-700">
              {game.content.map((item, index) => {
                if (item.type === "text") {
                  return splitIntoTokens(item.text).map((token, tokenIndex) => {
                    if (!token.isWord) {
                      return (
                        <span key={`${item.text}-${index}-${tokenIndex}`}>
                          {token.value}
                        </span>
                      );
                    }
                    const isAnswer = answerSet.has(token.value.toLowerCase());
                    return (
                      <button
                        key={`${item.text}-${index}-${tokenIndex}`}
                        type="button"
                        onClick={() => {
                          if (!isAnswer) {
                            void loadMeaning(token.value);
                          }
                        }}
                        className={`mx-0.5 inline-flex items-center rounded-md px-1 text-sm font-semibold ${
                          isAnswer
                            ? "cursor-default text-slate-400"
                            : "text-slate-700 underline decoration-dotted hover:text-slate-900"
                        }`}
                      >
                        {token.value}
                      </button>
                    );
                  });
                }

                const assignedItemId = assigned[index];
                const assignedItem = dragItems.find(
                  (candidate) => candidate.id === assignedItemId
                );
                const isCorrect = Boolean(assignedItemId);
                return (
                  <motion.span
                    key={`${item.text}-${index}`}
                    className={`mx-1 inline-flex min-w-[4rem] items-center justify-center rounded-lg border-2 border-dashed px-2 py-1 text-sm font-semibold transition ${
                      isCorrect
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-slate-300 bg-slate-50 text-slate-500"
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(event) => handleDropEvent(event, index)}
                    animate={
                      shakeIndex === index
                        ? { x: [0, -6, 6, -4, 4, 0] }
                        : { x: 0 }
                    }
                    transition={{ duration: 0.35 }}
                  >
                    <span>{assignedItem?.value ?? "____"}</span>
                  </motion.span>
                );
              })}
            </p>

            {selectedMeaning && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                <span className="font-semibold">{selectedMeaning.word}:</span>{" "}
                {selectedMeaning.meaning}
              </div>
            )}

            <div className="mt-8 border-t border-slate-200 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Word Bank
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {availableItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    draggable
                    onDragStart={(event) => handleDragStart(event, item.id)}
                    className="cursor-grab rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"
                  >
                    {item.value}
                  </button>
                ))}
                {availableItems.length === 0 && (
                  <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
                    All gaps completed!
                  </div>
                )}
              </div>
            </div>

            {isCompleted && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                  Nghia tu vung
                </p>
                {meaningsLoading && (
                  <p className="mt-2 text-xs text-emerald-600">
                    Dang tai nghia...
                  </p>
                )}
                <div className="mt-3 space-y-2">
                  {storyWords.map((word) => (
                    <div key={word} className="flex items-center gap-2">
                      <span className="font-semibold">{word}:</span>
                      <span>
                        {meaningCache[word.toLowerCase()] ?? "Chua co nghia"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
