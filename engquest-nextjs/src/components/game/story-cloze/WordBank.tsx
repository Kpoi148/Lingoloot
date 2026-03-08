// Sticky word bank that exposes the remaining draggable answer options.
import DraggableChip from "@/components/game/story-cloze/DraggableChip";
import type { StoryClozeBankItem } from "@/components/game/story-cloze/types";

export default function WordBank({
  availableItems,
}: {
  availableItems: StoryClozeBankItem[];
}) {
  return (
    <section className="sticky bottom-4 rounded-2xl border border-slate-100 bg-white/95 p-5 shadow-xl md:static">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Word Bank
        </p>
        <span className="text-xs text-slate-400">
          Còn {availableItems.length} từ
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {availableItems.map((item) => (
          <DraggableChip key={item.id} item={item} />
        ))}
        {availableItems.length === 0 && (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-600">
            Đã dùng hết!
          </span>
        )}
      </div>
    </section>
  );
}
