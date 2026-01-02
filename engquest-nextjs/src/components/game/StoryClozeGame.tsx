"use client";

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";
import { useMemo, useState } from "react";
import { X } from "lucide-react";

type GameData = {
  id: string;
  title: string;
  content: Array<{
    text: string;
    type: "text" | "gap";
    answer?: string;
  }>;
  distractors: string[];
};

type Status = "playing" | "checking" | "completed";
type Feedback = "correct" | "wrong" | null;

type BankItem = {
  id: string;
  word: string;
};

const shuffle = <T,>(items: T[]) => {
  const cloned = [...items];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
};

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="h-2 w-full rounded-full bg-slate-100">
    <div
      className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 transition-all duration-500"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const DraggableChip = ({ item }: { item: BankItem }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: item.id });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <motion.button
      ref={setNodeRef}
      layoutId={`chip-${item.id}`}
      type="button"
      style={style}
      {...listeners}
      {...attributes}
      className={`rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition ${
        isDragging ? "scale-105 opacity-80" : "hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      {item.word}
    </motion.button>
  );
};

const DroppableGap = ({
  id,
  filledItem,
  isWrong,
  onClear,
}: {
  id: string;
  filledItem?: BankItem;
  isWrong: boolean;
  onClear: () => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const filled = Boolean(filledItem);

  return (
    <motion.span
      ref={setNodeRef}
      className={`mx-1 inline-flex min-w-[5rem] items-center justify-center rounded-xl border-2 px-3 py-1 text-sm font-semibold transition ${
        filled
          ? "border-sky-300 bg-sky-50 text-sky-700"
          : "border-dashed border-slate-300 bg-slate-50 text-slate-400"
      } ${isOver ? "border-emerald-400 bg-emerald-50 text-emerald-700" : ""} ${
        isWrong ? "border-red-300 bg-red-50 text-red-600" : ""
      }`}
      animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
      onClick={filled ? onClear : undefined}
    >
      {filled ? (
        <motion.span
          layoutId={`chip-${filledItem?.id}`}
          className="cursor-pointer"
        >
          {filledItem?.word}
        </motion.span>
      ) : (
        "____"
      )}
    </motion.span>
  );
};

export default function StoryClozeGame({ initialGame }: { initialGame: GameData }) {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("playing");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [wrongGaps, setWrongGaps] = useState<string[]>([]);
  const [bankSeed] = useState(() => Math.random());

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } })
  );

  const gaps = useMemo(() => {
    return initialGame.content
      .map((item, index) =>
        item.type === "gap"
          ? { id: `gap-${index}`, answer: item.answer ?? item.text ?? "" }
          : null
      )
      .filter(Boolean) as Array<{ id: string; answer: string }>;
  }, [initialGame.content]);

  const bankItems = useMemo(() => {
    const answers = gaps.map((gap, index) => ({
      id: `answer-${index}-${bankSeed}`,
      word: gap.answer,
    }));
    const distractors = initialGame.distractors.map((word, index) => ({
      id: `distractor-${index}-${bankSeed}`,
      word,
    }));
    return shuffle([...answers, ...distractors]);
  }, [gaps, initialGame.distractors, bankSeed]);

  const usedIds = useMemo(
    () => new Set(Object.values(userAnswers)),
    [userAnswers]
  );

  const availableItems = useMemo(
    () => bankItems.filter((item) => !usedIds.has(item.id)),
    [bankItems, usedIds]
  );

  const filledItems = useMemo(() => {
    const map = new Map<string, BankItem>();
    bankItems.forEach((item) => map.set(item.id, item));
    return map;
  }, [bankItems]);

  const answeredCount = Object.keys(userAnswers).length;
  const progress = gaps.length
    ? Math.round((answeredCount / gaps.length) * 100)
    : 0;

  const handleDragEnd = ({
    active,
    over,
  }: {
    active: { id: string };
    over: { id: string } | null;
  }) => {
    if (!over) return;
    if (!over.id.toString().startsWith("gap-")) return;

    const gapId = over.id.toString();
    setStatus("playing");
    setFeedback(null);
    setWrongGaps([]);

    setUserAnswers((prev) => {
      const next = { ...prev };
      const existingGap = Object.entries(next).find(
        ([, value]) => value === active.id
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

    const wrong = gaps
      .filter((gap) => {
        const itemId = userAnswers[gap.id];
        if (!itemId) return true;
        const item = filledItems.get(itemId);
        return !item || item.word.trim() !== gap.answer.trim();
      })
      .map((gap) => gap.id);

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
    setTimeout(() => setWrongGaps([]), 600);
  };

  const resetGame = () => {
    setUserAnswers({});
    setStatus("playing");
    setScore(0);
    setFeedback(null);
    setWrongGaps([]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4 py-12 text-slate-900">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-xl shadow-slate-200/60">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Story Cloze
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                {initialGame.title}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Keo tha tu vao o trong. Nhan Check de kiem tra.
              </p>
            </div>
            <Link
              href="/topics"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              aria-label="Quit"
            >
              <X className="h-4 w-4" />
            </Link>
          </div>

          {gaps.length > 0 && (
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>
                  {answeredCount} / {gaps.length} filled
                </span>
                <span>{progress}%</span>
              </div>
              <ProgressBar progress={progress} />
            </div>
          )}
        </header>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <section className="rounded-2xl border-2 border-slate-100 bg-white p-6 shadow-xl">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-6 text-lg leading-relaxed text-slate-700">
                {initialGame.content.map((item, index) => {
                  if (item.type === "text") {
                    return (
                      <span key={`${item.text}-${index}`}>{item.text}</span>
                    );
                  }
                  const gapId = `gap-${index}`;
                  const filledId = userAnswers[gapId];
                  const filledItem = filledId
                    ? filledItems.get(filledId)
                    : undefined;
                  const isWrong = wrongGaps.includes(gapId);
                  return (
                    <DroppableGap
                      key={gapId}
                      id={gapId}
                      filledItem={filledItem}
                      isWrong={isWrong}
                      onClear={() => {
                        setUserAnswers((prev) => {
                          const next = { ...prev };
                          delete next[gapId];
                          return next;
                        });
                      }}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-500">
                  Score: {score}/{gaps.length}
                </div>
                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={status === "checking" || status === "completed"}
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "completed" ? "Completed" : "Check"}
                </button>
              </div>

              {feedback === "wrong" && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  Sai roi. Hay thu lai nhe!
                </div>
              )}
            </div>
          </section>

          <section className="sticky bottom-4 rounded-2xl border border-slate-100 bg-white/95 p-5 shadow-xl md:static">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Word Bank
              </p>
              <span className="text-xs text-slate-400">
                {availableItems.length} words left
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {availableItems.map((item) => (
                <DraggableChip key={item.id} item={item} />
              ))}
              {availableItems.length === 0 && (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-600">
                  All used!
                </span>
              )}
            </div>
          </section>
        </DndContext>
      </div>

      <AnimatePresence>
        {status === "completed" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                Victory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Hoan thanh!
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Ban dat {score}/{gaps.length} diem.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={resetGame}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20"
                >
                  Choi lai
                </button>
                <Link
                  href="/topics"
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                >
                  Thoat
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
