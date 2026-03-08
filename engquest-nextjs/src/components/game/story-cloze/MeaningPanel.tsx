// Inline dictionary result panel for clicked non-answer words.
import type { StoryClozeMeaningSelection } from "@/components/game/story-cloze/types";

export default function MeaningPanel({
  selection,
}: {
  selection: StoryClozeMeaningSelection;
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
      <span className="font-semibold">{selection.word}:</span>{" "}
      {selection.meaning}
    </div>
  );
}
