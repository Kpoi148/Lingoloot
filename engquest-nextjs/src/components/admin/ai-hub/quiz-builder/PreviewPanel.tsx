// Editable preview panel for reviewing and saving generated quiz content.
import { Save, Sparkles } from "lucide-react";
import type { EditableQuiz } from "@/components/admin/ai-hub/quiz-builder/types";

type PreviewPanelProps = {
  editableQuiz: EditableQuiz | null;
  isSaving: boolean;
  quizResult: object | null;
  onDiscard: () => void;
  onExplanationChange: (id: string, value: string) => void;
  onOptionChange: (id: string, optionIndex: number, value: string) => void;
  onQuestionChange: (id: string, value: string) => void;
  onSave: () => void;
  onTitleChange: (value: string) => void;
};

export default function PreviewPanel({
  editableQuiz,
  isSaving,
  quizResult,
  onDiscard,
  onExplanationChange,
  onOptionChange,
  onQuestionChange,
  onSave,
  onTitleChange,
}: PreviewPanelProps) {
  return (
    <section className="flex min-h-[calc(100vh-220px)] flex-col gap-4 overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20 lg:col-span-8">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        Quiz Preview
      </h2>

      {!quizResult ? (
        <div className="flex min-h-[320px] flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-400 shadow-sm">
            <Sparkles className="h-10 w-10" />
          </div>
          <p className="text-center text-sm text-slate-500">
            Configure instructions on the left to generate quiz.
          </p>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Quiz Title
              </label>
              <input
                value={editableQuiz?.title ?? ""}
                onChange={(event) => onTitleChange(event.target.value)}
                placeholder="Quiz title"
                className="h-11 w-full min-w-[220px] rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Đang lưu..." : "Save to Database"}
              </button>
              <button
                type="button"
                onClick={onDiscard}
                className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Discard
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            {(editableQuiz?.questions ?? []).map((question, index) => (
              <div
                key={question.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Câu hỏi {index + 1}
                  </label>
                  <input
                    value={question.question}
                    onChange={(event) =>
                      onQuestionChange(question.id, event.target.value)
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect = optionIndex === question.correctIndex;
                    return (
                      <input
                        key={`${question.id}-${optionIndex}`}
                        value={option}
                        onChange={(event) =>
                          onOptionChange(
                            question.id,
                            optionIndex,
                            event.target.value
                          )
                        }
                        className={`h-11 w-full rounded-2xl border px-4 text-sm shadow-sm focus:border-slate-300 focus:outline-none ${
                          isCorrect
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="mt-4 space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Explanation
                  </label>
                  <textarea
                    value={question.explanation}
                    onChange={(event) =>
                      onExplanationChange(question.id, event.target.value)
                    }
                    className="min-h-[90px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
