// Client-side API helpers for requesting AI-generated quiz drafts.
import type {
  CategoryOption,
  EditableQuiz,
  VocabularyItem,
} from "./types";

export const loadQuizBuilderData = async () => {
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

  return {
    categories: categoryPayload.data ?? [],
    vocabularies: vocabPayload.data ?? [],
  };
};

export const generateQuizWithAi = async ({
  topicName,
  customPrompt,
  questionCount,
  topicWords,
}: {
  topicName: string;
  customPrompt: string;
  questionCount: number;
  topicWords: VocabularyItem[];
}) => {
  const dataContext = topicWords.map((item) => ({
    word: item.word,
    meaning: item.meaning,
    example: item.example,
    example_meaning: item.example_meaning,
  }));
  const normalizedCount = Math.min(50, Math.max(1, questionCount || 10));
  const instructionWithCount = [
    `Topic: ${topicName}.`,
    customPrompt.trim(),
    `Question count: ${normalizedCount}. Return exactly ${normalizedCount} questions.`,
  ]
    .filter(Boolean)
    .join("\n");

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

  return payload.data ?? null;
};

export const saveGeneratedQuiz = async ({
  editableQuiz,
  categorySlug,
  level,
}: {
  editableQuiz: EditableQuiz;
  categorySlug: string;
  level: "Cơ bản" | "Trung bình" | "Khó";
}) => {
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
    throw new Error("Vui lòng kiểm tra lại câu hỏi và đáp án.");
  }

  const response = await fetch("/api/admin/quizzes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: editableQuiz.title.trim() || "Generated Quiz",
      category: categorySlug,
      level,
      questions,
    }),
  });

  const payload = (await response.json()) as { message?: string };
  if (!response.ok) {
    throw new Error(payload.message ?? "Không thể lưu quiz.");
  }
};
