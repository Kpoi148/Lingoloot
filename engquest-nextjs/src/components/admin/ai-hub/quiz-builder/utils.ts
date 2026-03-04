import type { CategoryOption, EditableQuiz, VocabularyItem } from "./types";

export const getTopicVocabularies = (
  topic: string,
  categories: CategoryOption[],
  vocabularies: VocabularyItem[]
) => {
  if (!topic.trim()) return [];
  const selectedCategory = categories.find((item) => item.slug === topic);
  const topicSlug = topic.trim();
  const topicId = selectedCategory?._id;

  return vocabularies.filter(
    (item) =>
      item.category?.slug === topicSlug ||
      (topicId ? item.category_id === topicId : false)
  );
};

export const filterVocabulariesByKeyword = (
  vocabSearch: string,
  topicVocabularies: VocabularyItem[]
) => {
  const needle = vocabSearch.trim().toLowerCase();
  if (!needle) return topicVocabularies;
  return topicVocabularies.filter((item) =>
    item.word.toLowerCase().includes(needle)
  );
};

export const selectVocabulariesByIds = (
  selectedWordIds: string[],
  vocabularies: VocabularyItem[]
) => {
  const selected = new Set(selectedWordIds);
  return vocabularies.filter((item) => selected.has(item._id));
};

export const normalizeQuizResult = (quizResult: object | null): EditableQuiz | null => {
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
};
