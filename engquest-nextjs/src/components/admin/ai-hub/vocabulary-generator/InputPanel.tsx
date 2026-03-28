// Input form for prompt, level, and destination category selection.
import { AlertCircle, Loader2 } from "lucide-react";
import {
  type CategoryOption,
  vocabularyLevels,
} from "@/components/admin/ai-hub/vocabulary-generator/types";

type InputPanelProps = {
  categories: CategoryOption[];
  categoriesError?: string | null;
  categoryId: string;
  isLoading: boolean;
  level: (typeof vocabularyLevels)[number];
  prompt: string;
  onCategoryChange: (value: string) => void;
  onGenerate: () => void;
  onLevelChange: (value: (typeof vocabularyLevels)[number]) => void;
  onPromptChange: (value: string) => void;
};

export default function InputPanel({
  categories,
  categoriesError = null,
  categoryId,
  isLoading,
  level,
  prompt,
  onCategoryChange,
  onGenerate,
  onLevelChange,
  onPromptChange,
}: InputPanelProps) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20 lg:col-span-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Input Parameters
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Cấu hình nhanh nội dung bạn muốn AI tạo ra.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Nhập từ khóa hoặc chủ đề
        </label>
        <textarea
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          rows={6}
          placeholder="Ví dụ: Travel, Food, Technology..."
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-600"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Chọn cấp độ
        </label>
        <select
          value={level}
          onChange={(event) =>
            onLevelChange(event.target.value as (typeof vocabularyLevels)[number])
          }
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-600"
        >
          {vocabularyLevels.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Chủ đề lưu (bắt buộc khi lưu)
        </label>
        {categoriesError ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Không thể tải danh sách chủ đề.</p>
              <p className="mt-1">{categoriesError}</p>
            </div>
          </div>
        ) : null}
        <select
          value={categoryId}
          onChange={(event) => onCategoryChange(event.target.value)}
          disabled={Boolean(categoriesError) && categories.length === 0}
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-600"
        >
          <option value="">Chọn chủ đề</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={isLoading}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang tạo...
          </>
        ) : (
          "Generate"
        )}
      </button>
    </section>
  );
}
