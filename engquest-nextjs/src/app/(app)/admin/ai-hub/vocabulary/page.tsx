"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCcw, Save } from "lucide-react";
import toast from "react-hot-toast";

type CategoryOption = {
  _id: string;
  name: string;
  slug?: string;
};

type WordResult = {
  word: string;
  ipa?: string;
  meaning?: string;
  example?: string;
  example_meaning?: string;
};

type QuizQuestion = {
  question?: string;
  prompt?: string;
  options?: string[];
  choices?: string[];
};

type QuizResult = {
  title?: string;
  questions?: QuizQuestion[];
};

const levels = ["Cơ bản", "Trung bình", "Khó"] as const;

const getRequestedCount = (input: string) => {
  const match = input.match(/(\d+)/);
  if (!match) return null;
  const value = Number.parseInt(match[1], 10);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.min(value, 50);
};

const isWordResult = (value: unknown): value is WordResult => {
  return Boolean(
    value &&
      typeof value === "object" &&
      "word" in value &&
      typeof (value as WordResult).word === "string"
  );
};

const isQuizResult = (value: unknown): value is QuizResult => {
  return Boolean(
    value &&
      typeof value === "object" &&
      Array.isArray((value as QuizResult).questions)
  );
};

export default function AdminAIVocabularyPage() {
  const [prompt, setPrompt] = useState("");
  const [level, setLevel] =
    useState<(typeof levels)[number]>("Cơ bản");
  const [resultData, setResultData] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories", {
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          data?: CategoryOption[];
        };

        if (!response.ok) {
          return;
        }

        if (active) {
          const items = payload.data ?? [];
          setCategories(items);
          if (items.length === 1) {
            setCategoryId(items[0]._id);
          }
        }
      } catch {
        if (active) {
          setCategories([]);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const wordItems = useMemo(() => {
    if (!resultData) return null;
    if (Array.isArray(resultData)) {
      const items = resultData.filter(isWordResult);
      return items.length ? items : null;
    }
    if (isWordResult(resultData)) {
      return [resultData];
    }
    return null;
  }, [resultData]);

  const quizData = useMemo(() => {
    if (!resultData) return null;
    if (isQuizResult(resultData)) {
      return resultData;
    }
    if (
      resultData &&
      typeof resultData === "object" &&
      "quiz" in resultData &&
      isQuizResult((resultData as { quiz?: unknown }).quiz)
    ) {
      return (resultData as { quiz?: QuizResult }).quiz ?? null;
    }
    return null;
  }, [resultData]);
  const hasWordItems = Boolean(wordItems?.length);
  const hasQuizData = Boolean(quizData);

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast.error("Vui lòng nhập từ khóa hoặc chủ đề.");
      return;
    }

    const requestedCount = getRequestedCount(trimmedPrompt);
    const loadingToast = toast.loading("Đang tạo nội dung...");
    setIsLoading(true);
    try {
      const countInstruction = requestedCount
        ? `\nReturn exactly ${requestedCount} word objects. Do not add extra words.`
        : "";
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${trimmedPrompt}\nLevel: ${level}${countInstruction}`,
          type: "auto",
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        data?: unknown;
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Không thể tạo nội dung.");
      }

      const nextData = payload.data ?? null;
      if (requestedCount && Array.isArray(nextData)) {
        setResultData(nextData.slice(0, requestedCount));
      } else {
        setResultData(nextData);
      }
      toast.success("Đã tạo nội dung.", { id: loadingToast });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tạo nội dung.",
        { id: loadingToast }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!wordItems || wordItems.length === 0) {
      toast.error("Không có dữ liệu từ vựng để lưu.");
      return;
    }

    if (!categoryId) {
      toast.error("Vui lòng chọn chủ đề để lưu vào hệ thống.");
      return;
    }

    const savingToast = toast.loading("Đang lưu dữ liệu...");
    setIsSaving(true);
    try {
      for (const item of wordItems) {
        if (!item.word || !item.meaning) {
          throw new Error("Dữ liệu từ vựng chưa đầy đủ để lưu.");
        }

        const response = await fetch("/api/admin/vocabularies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            word: item.word,
            ipa: item.ipa ?? "",
            meaning: item.meaning,
            example: item.example ?? "",
            example_meaning: item.example_meaning ?? "",
            category_id: categoryId,
            media: {},
          }),
        });

        const payload = (await response.json()) as { message?: string };

        if (!response.ok) {
          throw new Error(payload.message ?? "Lưu dữ liệu thất bại.");
        }
      }

      toast.success("Đã lưu vào cơ sở dữ liệu.", { id: savingToast });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Lưu dữ liệu thất bại.",
        { id: savingToast }
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 lg:col-span-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Input Parameters
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Cấu hình nhanh nội dung bạn muốn AI tạo ra.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Nhập từ khóa hoặc chủ đề
            </label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={6}
              placeholder="Ví dụ: Travel, Food, Technology..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Chọn cấp độ
            </label>
            <select
              value={level}
              onChange={(event) =>
                setLevel(event.target.value as (typeof levels)[number])
              }
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none"
            >
              {levels.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Chủ đề lưu (bắt buộc khi lưu)
            </label>
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none"
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
            onClick={handleGenerate}
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

        <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Preview Zone
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Kết quả từ AI sẽ được hiển thị trực quan tại đây.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCcw className="h-4 w-4" />
                Regenerate
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !resultData}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Đang lưu..." : "Save to Database"}
              </button>
            </div>
          </div>

          {!resultData && (
            <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
              Kết quả sẽ hiển thị ở đây...
            </div>
          )}

          {hasWordItems && (
            <div className="grid gap-4 md:grid-cols-2">
              {wordItems?.map((item, index) => (
                <div
                  key={`${item.word}-${index}`}
                  className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400">
                    Flashcard
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-900">
                    {item.word}
                  </h3>
                  {item.ipa && (
                    <p className="text-sm text-slate-500">{item.ipa}</p>
                  )}

                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {item.meaning && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Meaning
                        </p>
                        <p className="mt-1 text-slate-700">{item.meaning}</p>
                      </div>
                    )}
                    {item.example && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Example
                        </p>
                        <p className="mt-1 text-slate-700">{item.example}</p>
                        {item.example_meaning && (
                          <p className="mt-1 text-xs text-slate-500">
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
      </div>
    </div>
  );
}
