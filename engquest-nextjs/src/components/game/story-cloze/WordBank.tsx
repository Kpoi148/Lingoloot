// Sticky word bank that exposes the remaining draggable answer options.
import DraggableChip from "@/components/game/story-cloze/DraggableChip";
import type { StoryClozeBankItem } from "@/components/game/story-cloze/types";

export default function WordBank({
  availableItems,
}: {
  availableItems: StoryClozeBankItem[];
}) {
  return (
    <section className="rounded-[28px] border border-black/[0.08] bg-white/88 p-5 shadow-[0_28px_70px_-48px_rgba(15,23,42,0.48)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/82 dark:shadow-[0_28px_70px_-48px_rgba(2,6,23,0.92)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Word Bank
        </p>
        <span className="rounded-full border border-black/[0.08] bg-black/[0.03] px-3 py-1 text-xs font-semibold text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
          Còn {availableItems.length} từ
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Kéo từng từ vào đúng ô trống trong story board. Bấm vào ô đã điền để
        xóa nếu cần đổi đáp án.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {availableItems.map((item) => (
          <DraggableChip key={item.id} item={item} />
        ))}
        {availableItems.length === 0 && (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-500/[0.14] dark:text-emerald-100">
            Đã dùng hết!
          </span>
        )}
      </div>
    </section>
  );
}
