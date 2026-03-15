"use client";

// Draggable word chip rendered inside the Story Cloze word bank.
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import type { StoryClozeBankItem } from "@/components/game/story-cloze/types";

export default function DraggableChip({
  item,
}: {
  item: StoryClozeBankItem;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: item.id });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? "none" : undefined,
        willChange: "transform",
      }
    : undefined;

  return (
    <motion.button
      ref={setNodeRef}
      type="button"
      style={style}
      {...listeners}
      {...attributes}
      className={`touch-none rounded-full border border-black/[0.08] bg-white/92 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.4)] ${
        isDragging
          ? "opacity-0"
          : "transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/[0.08] dark:text-slate-100 dark:hover:border-amber-400/30 dark:hover:bg-white/[0.12]"
      }`}
    >
      {item.word}
    </motion.button>
  );
}
