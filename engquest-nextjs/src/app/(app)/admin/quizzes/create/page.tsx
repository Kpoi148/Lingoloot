"use client";

import { useEffect, useState } from "react";

type CategoryOption = {
  _id: string;
  name: string;
  slug: string;
};

type QuestionForm = {
  id: string;
  question_text: string;
  options: [string, string, string, string];
  correct_index: number;
};

type ToastState = {
  message: string;
  type: "success" | "error";
};

const levels = ["Cơ bản", "Trung bình", "Khó"] as const;

const createQuestion = (): QuestionForm => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  question_text: "",
  options: ["", "", "", ""],
  correct_index: 0,
});

export default function AdminQuizCreatePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] =
    useState<(typeof levels)[number]>("Trung bình");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [questions, setQuestions] = useState<QuestionForm[]>([createQuestion()]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const response = await fetch("/api/categories", { cache: "no-store" });
        const payload = (await response.json()) as { data?: CategoryOption[] };
        if (!response.ok) {
          throw new Error("Không thể tải danh sách chủ đề.");
        }
        if (active) {
          setCategories(payload.data ?? []);
        }
      } catch (error) {
        setToast({
          message:
            error instanceof Error ? error.message : "Không thể tải chủ đề.",
          type: "error",
        });
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleQuestionChange = (
    id: string,
    field: "question_text" | "option",
    value: string,
    optionIndex?: number
  ) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== id) return question;
        if (field === "question_text") {
          return { ...question, question_text: value };
        }
        if (field === "option" && typeof optionIndex === "number") {
          const options = [...question.options] as QuestionForm["options"];
          options[optionIndex] = value;
          return { ...question, options };
        }
        return question;
      })
    );
  };

  const handleCorrectChange = (id: string, index: number) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id ? { ...question, correct_index: index } : question
      )
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createQuestion()]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !category.trim()) {
      setToast({ message: "Vui lòng nhập tên và chủ đề.", type: "error" });
      return;
    }

    if (questions.length === 0) {
      setToast({ message: "Vui lòng thêm ít nhất 1 câu hỏi.", type: "error" });
      return;
    }

    const payload = {
      title: title.trim(),
      category,
      level,
      questions: questions.map((question) => ({
        question_text: question.question_text.trim(),
        options: question.options.map((option) => option.trim()),
        correct_answer: question.options[question.correct_index]?.trim(),
      })),
    };

    if (
      payload.questions.some(
        (question) =>
          !question.question_text ||
          question.options.length !== 4 ||
          question.options.some((option) => !option) ||
          !question.correct_answer
      )
    ) {
      setToast({ message: "Vui lòng nhập đầy đủ câu hỏi và đáp án.", type: "error" });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Không thể lưu bài quiz.");
      }

      setToast({ message: "Đã lưu bài quiz.", type: "success" });
      setTitle("");
      setCategory("");
      setLevel("Trung bình");
      setQuestions([createQuestion()]);
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Không thể lưu bài quiz.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60">
        <h1 className="text-2xl font-semibold text-slate-900">
          Tạo bài tập Quiz
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Thiết lập câu hỏi trắc nghiệm cho từng chủ đề.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Tên bài Quiz
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700"
              placeholder="Quiz giao thông cơ bản"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Chủ đề
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700"
            >
              <option value="">Chọn chủ đề</option>
              {categories.map((item) => (
                <option key={item._id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Mức độ
            </label>
            <select
              value={level}
              onChange={(event) =>
                setLevel(event.target.value as (typeof levels)[number])
              }
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700"
            >
              {levels.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Câu hỏi {index + 1}
              </h2>
              <button
                type="button"
                onClick={() => removeQuestion(question.id)}
                className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                disabled={questions.length === 1}
              >
                Xóa câu hỏi
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Nội dung câu hỏi
              </label>
              <input
                value={question.question_text}
                onChange={(event) =>
                  handleQuestionChange(
                    question.id,
                    "question_text",
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700"
                placeholder="Nhập nội dung câu hỏi..."
              />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {question.options.map((option, optionIndex) => (
                <div key={`${question.id}-${optionIndex}`} className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Đáp án {String.fromCharCode(65 + optionIndex)}
                  </label>
                  <input
                    value={option}
                    onChange={(event) =>
                      handleQuestionChange(
                        question.id,
                        "option",
                        event.target.value,
                        optionIndex
                      )
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700"
                    placeholder={`Nhập đáp án ${String.fromCharCode(65 + optionIndex)}`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Đáp án đúng
              </p>
              <div className="mt-3 flex flex-wrap gap-4">
                {question.options.map((_, optionIndex) => (
                  <label
                    key={`${question.id}-correct-${optionIndex}`}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600"
                  >
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={question.correct_index === optionIndex}
                      onChange={() => handleCorrectChange(question.id, optionIndex)}
                    />
                    {String.fromCharCode(65 + optionIndex)}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={addQuestion}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Thêm câu hỏi
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Đang lưu..." : "Lưu bài tập"}
        </button>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ${
            toast.type === "success"
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
