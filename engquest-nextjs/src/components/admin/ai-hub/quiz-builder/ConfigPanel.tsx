// Left-side configuration panel for topic, vocabulary, prompt, and quiz generation options.
import { Loader2 } from "lucide-react";
import {
  defaultPrompt,
  levels,
  presets,
  type CategoryOption,
  type VocabularyItem,
} from "@/components/admin/ai-hub/quiz-builder/types";

type ConfigPanelProps = {
  categories: CategoryOption[];
  customPrompt: string;
  filteredVocabularies: VocabularyItem[];
  isLoading: boolean;
  level: (typeof levels)[number];
  questionCount: number;
  selectedWordIds: string[];
  topic: string;
  vocabSearch: string;
  onCustomPromptChange: (value: string) => void;
  onGenerate: () => void;
  onLevelChange: (value: (typeof levels)[number]) => void;
  onQuestionCountChange: (value: number) => void;
  onSelectAll: () => void;
  onTopicChange: (value: string) => void;
  onToggleWord: (id: string) => void;
  onVocabSearchChange: (value: string) => void;
  onClearSelection: () => void;
};

export default function ConfigPanel({
  categories,
  customPrompt,
  filteredVocabularies,
  isLoading,
  level,
  questionCount,
  selectedWordIds,
  topic,
  vocabSearch,
  onCustomPromptChange,
  onGenerate,
  onLevelChange,
  onQuestionCountChange,
  onSelectAll,
  onTopicChange,
  onToggleWord,
  onVocabSearchChange,
  onClearSelection,
}: ConfigPanelProps) {
  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20 lg:col-span-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
          Configuration Panel
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Quiz Builder
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Configure data source and AI instructions before generating a quiz.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Select Topic
        </label>
        <select
          value={topic}
          onChange={(event) => onTopicChange(event.target.value)}
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="">Chọn chủ đề</option>
          {categories.map((item) => (
            <option key={item._id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500">
          Chọn chủ đề để lấy từ vựng. Không chọn từ cụ thể sẽ dùng toàn bộ từ
          của chủ đề.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Vocabulary Source (Optional)
        </label>
        <input
          value={vocabSearch}
          onChange={(event) => onVocabSearchChange(event.target.value)}
          placeholder="Tìm theo từ vựng..."
          className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        />
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Đã chọn {selectedWordIds.length} từ.</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSelectAll}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              Chọn tất cả
            </button>
            <button
              type="button"
              onClick={onClearSelection}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              Bỏ chọn
            </button>
          </div>
        </div>

        <div className="max-h-56 space-y-2 overflow-auto rounded-2xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
          {!topic && (
            <p className="text-xs text-slate-400">
              Hãy chọn chủ đề để hiển thị danh sách từ.
            </p>
          )}
          {topic && filteredVocabularies.length === 0 && (
            <p className="text-xs text-slate-400">
              Chủ đề này chưa có từ vựng phù hợp.
            </p>
          )}
          {topic &&
            filteredVocabularies.map((item) => {
              const isSelected = selectedWordIds.includes(item._id);
              return (
                <label
                  key={item._id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2 transition ${
                    isSelected
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400"
                      : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {item.word}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.meaning}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleWord(item._id)}
                    className="h-4 w-4"
                  />
                </label>
              );
            })}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Custom Prompt Configuration
        </label>
        <textarea
          value={customPrompt || defaultPrompt}
          onChange={(event) => onCustomPromptChange(event.target.value)}
          className="min-h-[200px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        />
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onCustomPromptChange(preset.value)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Số câu hỏi
        </label>
        <input
          type="number"
          min={1}
          max={50}
          value={questionCount}
          onChange={(event) =>
            onQuestionCountChange(Number.parseInt(event.target.value, 10) || 1)
          }
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        />
        <p className="text-xs text-slate-500">
          Tối đa 50 câu để đảm bảo chất lượng.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Mức độ
        </label>
        <select
          value={level}
          onChange={(event) =>
            onLevelChange(event.target.value as (typeof levels)[number])
          }
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          {levels.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={isLoading}
        className="mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        Generate Quiz
      </button>
    </section>
  );
}
