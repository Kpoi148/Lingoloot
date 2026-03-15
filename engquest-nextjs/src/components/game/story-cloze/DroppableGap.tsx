"use client";

// Droppable gap slot that accepts a dragged answer and highlights invalid state.
import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import type { StoryClozeBankItem } from "@/components/game/story-cloze/types";

type DroppableGapProps = {
  id: string;
  filledItem?: StoryClozeBankItem;
  isWrong: boolean;
  onClear: () => void;
};

export default function DroppableGap({
  id,
  filledItem,
  isWrong,
  onClear,
}: DroppableGapProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const filled = Boolean(filledItem);

  return (
    <motion.span
      ref={setNodeRef}
      className={`mx-1 inline-flex min-w-[5.5rem] items-center justify-center rounded-2xl border-2 px-3 py-1.5 text-sm font-semibold transition ${
        filled
          ? "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-400/30 dark:bg-sky-500/[0.14] dark:text-sky-100"
          : "border-dashed border-slate-300 bg-slate-50 text-slate-400 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-500"
      } ${isOver ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/[0.14] dark:text-emerald-100" : ""} ${
        isWrong ? "border-red-300 bg-red-50 text-red-600 dark:border-red-400/40 dark:bg-red-500/[0.14] dark:text-red-100" : ""
      }`}
      animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
      onClick={filled ? onClear : undefined}
    >
      {filled ? (
        <motion.span className="cursor-pointer">{filledItem?.word}</motion.span>
      ) : (
        "____"
      )}
    </motion.span>
  );
}
