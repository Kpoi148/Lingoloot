// Inline dictionary result panel for clicked non-answer words.
import type { StoryClozeMeaningSelection } from "@/components/game/story-cloze/types";

export default function MeaningPanel({
  selection,
}: {
  selection: StoryClozeMeaningSelection;
}) {
  return (
    <div className="rounded-[28px] border border-amber-200/80 bg-amber-50/90 px-5 py-4 shadow-[0_24px_60px_-44px_rgba(217,119,6,0.5)] dark:border-amber-400/18 dark:bg-amber-500/[0.12] dark:shadow-[0_24px_60px_-44px_rgba(217,119,6,0.25)]">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700 dark:text-amber-100">
        Tra nhanh
      </p>
      <h3 className="mt-2 text-lg font-semibold text-amber-950 dark:text-white">
        {selection.word}
      </h3>
      <p className="mt-2 text-sm leading-7 text-amber-900 dark:text-amber-100">
        {selection.meaning}
      </p>
    </div>
  );
}
