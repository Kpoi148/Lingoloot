// Preview surface for generated vocabulary cards or quiz-shaped AI payloads.
import { RefreshCcw, Save } from "lucide-react";
import type {
  QuizResult,
  WordResult,
} from "@/components/admin/ai-hub/vocabulary-generator/types";

type PreviewPanelProps = {
  hasQuizData: boolean;
  hasWordItems: boolean;
  isLoading: boolean;
  isSaving: boolean;
  prompt: string;
  quizData: QuizResult | null;
  resultData: unknown;
  wordItems: WordResult[] | null;
  onGenerate: () => void;
  onSave: () => void;
};

export default function PreviewPanel({
  hasQuizData,
  hasWordItems,
  isLoading,
  isSaving,
  prompt,
  quizData,
  resultData,
  wordItems,
  onGenerate,
  onSave,
}: PreviewPanelProps) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20 lg:col-span-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Preview Zone
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Kết quả từ AI sẽ được hiển thị trực quan tại đây.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onGenerate}
            disabled={isLoading || !prompt.trim()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <RefreshCcw className="h-4 w-4" />
            Regenerate
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || !resultData}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Đang lưu..." : "Save to Database"}
          </button>
        </div>
      </div>

      {!resultData && (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500">
          Kết quả sẽ hiển thị ở đây...
        </div>
      )}

      {hasWordItems && (
        <div className="grid gap-4 md:grid-cols-2">
          {wordItems?.map((item, index) => (
            <div
              key={`${item.word}-${index}`}
              className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400">
                Flashcard
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {item.word}
              </h3>
              {item.ipa && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.ipa}
                </p>
              )}

              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                {item.meaning && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                      Meaning
                    </p>
                    <p className="mt-1 text-slate-700 dark:text-slate-300">
                      {item.meaning}
                    </p>
                  </div>
                )}
                {item.example && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                      Example
                    </p>
                    <p className="mt-1 text-slate-700 dark:text-slate-300">
                      {item.example}
                    </p>
                    {item.example_meaning && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                        {item.example_meaning}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!hasWordItems && hasQuizData && (
        <div className="space-y-4">
          {quizData?.title && (
            <h3 className="text-lg font-semibold text-slate-900">
              {quizData.title}
            </h3>
          )}
          {(quizData?.questions ?? []).map((question, index) => {
            const promptText =
              question.question ?? question.prompt ?? `Câu ${index + 1}`;
            const options = question.options ?? question.choices ?? [];

            return (
              <div
                key={`${promptText}-${index}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {index + 1}. {promptText}
                </p>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {options.map((option) => (
                    <div
                      key={option}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600"
                    >
                      {option}
                    </div>
                  ))}
                  {!options.length && (
                    <p className="text-sm text-slate-400">
                      Chưa có lựa chọn đáp án.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!hasWordItems && !hasQuizData && resultData != null && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Không thể hiển thị dữ liệu hiện tại. Vui lòng thử lại với nội dung
          khác.
        </div>
      )}
    </section>
  );
}
