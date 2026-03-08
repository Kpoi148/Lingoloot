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
      className={`touch-none rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ${
        isDragging
          ? "opacity-0"
          : "transition hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      {item.word}
    </motion.button>
  );
}
