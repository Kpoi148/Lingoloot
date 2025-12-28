"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Save, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const defaultPrompt =
  "Generate a 5-question multiple-choice quiz. Level: Intermediate. Explanation language: Vietnamese.";

const presets = [
  {
    label: "Hard Mode",
    value: "Create difficult questions with tricky distractors.",
  },
  { label: "Fun Mode", value: "Use funny and humorous examples." },
  { label: "Kid Mode", value: "Use simple words for children." },
];

type CategoryOption = {
  _id: string;
  name: string;
  slug: string;
};

type VocabularyItem = {
  _id: string;
  word: string;
  meaning: string;
  example?: string;
  example_meaning?: string;
  category_id?: string;
  category?: {
    name?: string;
    slug?: string;
  };
};

type EditableQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type EditableQuiz = {
  title: string;
  questions: EditableQuestion[];
};

export default function AdminQuizBuilderPage() {
  const [customPrompt, setCustomPrompt] = useState(defaultPrompt);
  const [topic, setTopic] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [vocabularies, setVocabularies] = useState<VocabularyItem[]>([]);
  const [vocabSearch, setVocabSearch] = useState("");
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState<object | null>(null);
  const [editableQuiz, setEditableQuiz] = useState<EditableQuiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const [categoryRes, vocabRes] = await Promise.all([
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/admin/vocabularies", { cache: "no-store" }),
        ]);

        const categoryPayload = (await categoryRes.json()) as {
          data?: CategoryOption[];
          message?: string;
        };
        const vocabPayload = (await vocabRes.json()) as {
          data?: VocabularyItem[];
          message?: string;
        };

        if (!categoryRes.ok) {
          throw new Error(categoryPayload.message ?? "Không thể tải chủ đề.");
        }

        if (!vocabRes.ok) {
          throw new Error(vocabPayload.message ?? "Không thể tải từ vựng.");
        }

        if (active) {
          const nextCategories = categoryPayload.data ?? [];
          setCategories(nextCategories);
          if (!topic && nextCategories.length > 0) {
            setTopic(nextCategories[0].slug);
          }
          setVocabularies(vocabPayload.data ?? []);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Không thể tải dữ liệu."
        );
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const selectedCategory = useMemo(
    () => categories.find((item) => item.slug === topic),
    [categories, topic]
  );

  const topicVocabularies = useMemo(() => {
    if (!topic.trim()) return [];
    const topicSlug = topic.trim();
    const topicId = selectedCategory?._id;
    return vocabularies.filter(
      (item) =>
        item.category?.slug === topicSlug ||
        (topicId ? item.category_id === topicId : false)
    );
  }, [topic, selectedCategory, vocabularies]);

  const filteredVocabularies = useMemo(() => {
    const needle = vocabSearch.trim().toLowerCase();
    if (!needle) return topicVocabularies;
    return topicVocabularies.filter((item) =>
      item.word.toLowerCase().includes(needle)
    );
  }, [vocabSearch, topicVocabularies]);

  const selectedWords = useMemo(() => {
    const selected = new Set(selectedWordIds);
    return vocabularies.filter((item) => selected.has(item._id));
  }, [selectedWordIds, vocabularies]);

  useEffect(() => {
    setSelectedWordIds([]);
    setVocabSearch("");
  }, [topic]);

  const normalizedQuiz = useMemo(() => {
    if (!quizResult || typeof quizResult !== "object") {
      return null;
    }

    const raw = quizResult as {
      title?: string;
      questions?: Array<{
        question?: string;
        question_text?: string;
        prompt?: string;
        options?: string[];
        choices?: string[];
        correctAnswer?: string;
        correct_answer?: string;
        correct_index?: number;
        explanation?: string;
      }>;
    };

    const title =
      typeof raw.title === "string" && raw.title.trim()
        ? raw.title.trim()
        : "Generated Quiz";

    const questions = (raw.questions ?? []).map((question, index) => {
      const text =
        question.question ??
        question.question_text ??
        question.prompt ??
        `Question ${index + 1}`;
      const optionsSource = question.options ?? question.choices ?? [];
      const options = optionsSource.slice(0, 4).map((option) => option ?? "");
      while (options.length < 4) {
        options.push("");
      }

      let correctIndex = 0;
      if (Number.isFinite(question.correct_index)) {
        correctIndex = Math.min(3, Math.max(0, question.correct_index ?? 0));
      } else if (typeof question.correctAnswer === "string") {
        const idx = options.findIndex((option) => option === question.correctAnswer);
        correctIndex = idx >= 0 ? idx : 0;
      } else if (typeof question.correct_answer === "string") {
        const idx = options.findIndex((option) => option === question.correct_answer);
        correctIndex = idx >= 0 ? idx : 0;
      }

      return {
        id: `${Date.now()}-${index}`,
        question: text,
        options,
        correctIndex,
        explanation: question.explanation ?? "",
      };
    });

    return { title, questions };
  }, [quizResult]);

  useEffect(() => {
    setEditableQuiz(normalizedQuiz);
  }, [normalizedQuiz]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Vui lòng chọn chủ đề trước khi tạo quiz.");
      return;
    }

    const topicWords =
      selectedWordIds.length > 0 ? selectedWords : topicVocabularies;

    if (topicWords.length === 0) {
      toast.error("Chủ đề này chưa có từ vựng để tạo quiz.");
      return;
    }

    setIsLoading(true);
    try {
      const topicName =
        categories.find((item) => item.slug === topic)?.name ?? topic;
      const dataContext = topicWords.map((item) => ({
        word: item.word,
        meaning: item.meaning,
        example: item.example,
        example_meaning: item.example_meaning,
      }));
      const normalizedCount = Math.min(50, Math.max(1, questionCount || 10));
      const instructionWithCount = `Topic: ${topicName}.\n${customPrompt.trim()}\nQuestion count: ${normalizedCount}. Return exactly ${normalizedCount} questions.`;

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quiz_custom",
          userInstruction: instructionWithCount,
          dataContext,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        data?: object;
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Không thể tạo quiz.");
      }

      setQuizResult(payload.data ?? null);
      setEditableQuiz(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tạo quiz."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setEditableQuiz((prev) => (prev ? { ...prev, title: value } : prev));
  };

  const handleQuestionChange = (id: string, value: string) => {
    setEditableQuiz((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questions: prev.questions.map((question) =>
          question.id === id ? { ...question, question: value } : question
        ),
      };
    });
  };

  const handleOptionChange = (
    id: string,
    optionIndex: number,
    value: string
  ) => {
    setEditableQuiz((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questions: prev.questions.map((question) => {
          if (question.id !== id) return question;
          const nextOptions = [...question.options];
          nextOptions[optionIndex] = value;
          return { ...question, options: nextOptions };
        }),
      };
    });
  };

  const handleExplanationChange = (id: string, value: string) => {
    setEditableQuiz((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questions: prev.questions.map((question) =>
          question.id === id ? { ...question, explanation: value } : question
        ),
      };
    });
  };

  const handleDiscard = () => {
    setQuizResult(null);
    setEditableQuiz(null);
  };

  const handleSave = async () => {
    if (!editableQuiz || editableQuiz.questions.length === 0) {
      toast.error("Chưa có dữ liệu quiz để lưu.");
      return;
    }

    if (!topic.trim()) {
      toast.error("Vui lòng chọn chủ đề để liên kết quiz.");
      return;
    }

    const categorySlug =
      categories.find((item) => item.slug === topic)?.slug ?? topic;

    if (!categorySlug) {
      toast.error("Chủ đề không hợp lệ.");
      return;
    }

    const questions = editableQuiz.questions.map((question) => {
      const options = question.options.map((option) => option.trim());
      const correct_answer =
        options[question.correctIndex]?.trim() ?? options[0] ?? "";
      return {
        question_text: question.question.trim(),
        options,
        correct_answer,
      };
    });

    const hasInvalid = questions.some((item) => {
      if (!item.question_text || item.options.length !== 4) return true;
      if (item.options.some((option) => !option)) return true;
      return !item.options.includes(item.correct_answer);
    });

    if (hasInvalid) {
      toast.error("Vui lòng kiểm tra lại câu hỏi và đáp án.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editableQuiz.title.trim() || "Generated Quiz",
          category: categorySlug,
          questions,
        }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Không thể lưu quiz.");
      }

      toast.success("Đã lưu quiz vào cơ sở dữ liệu.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể lưu quiz."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleWord = (id: string) => {
    setSelectedWordIds((prev) =>
      prev.includes(id) ? prev.filter((wordId) => wordId !== id) : [...prev, id]
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 lg:col-span-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Configuration Panel
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Quiz Builder
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Configure data source and AI instructions before generating a quiz.
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Select Topic
          </label>
          <select
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none"
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
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Vocabulary Source (Optional)
          </label>
          <input
            value={vocabSearch}
            onChange={(event) => setVocabSearch(event.target.value)}
            placeholder="Tìm theo từ vựng..."
            className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Đã chọn {selectedWordIds.length} từ.</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSelectedWordIds(
                    filteredVocabularies.map((item) => item._id)
                  )
                }
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Chọn tất cả
              </button>
              <button
                type="button"
                onClick={() => setSelectedWordIds([])}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Bỏ chọn
              </button>
            </div>
          </div>
          <div className="max-h-56 space-y-2 overflow-auto rounded-2xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-600">
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
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-slate-700">
                        {item.word}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.meaning}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleWord(item._id)}
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
            value={customPrompt}
            onChange={(event) => setCustomPrompt(event.target.value)}
            className="min-h-[200px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setCustomPrompt(preset.value)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
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
              setQuestionCount(Number.parseInt(event.target.value, 10) || 1)
            }
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none"
          />
          <p className="text-xs text-slate-500">
            Tối đa 50 câu để đảm bảo chất lượng.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Generate Quiz
        </button>
      </section>

      <section className="flex min-h-[calc(100vh-220px)] flex-col gap-4 overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 lg:col-span-8">
        <h2 className="text-lg font-semibold text-slate-900">Quiz Preview</h2>
        {!quizResult ? (
          <div className="flex min-h-[320px] flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
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
                  onChange={(event) => handleTitleChange(event.target.value)}
                  placeholder="Quiz title"
                  className="h-11 w-full min-w-[220px] rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Đang lưu..." : "Save to Database"}
                </button>
                <button
                  type="button"
                  onClick={handleDiscard}
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
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Câu hỏi {index + 1}
                    </label>
                    <input
                      value={question.question}
                      onChange={(event) =>
                        handleQuestionChange(question.id, event.target.value)
                      }
                      className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none"
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
                            handleOptionChange(
                              question.id,
                              optionIndex,
                              event.target.value
                            )
                          }
                          className={`h-11 w-full rounded-2xl border px-4 text-sm shadow-sm focus:border-slate-300 focus:outline-none ${
                            isCorrect
                              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-white text-slate-700"
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
                        handleExplanationChange(question.id, event.target.value)
                      }
                      className="min-h-[90px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </section>
    </div>
  );
}
