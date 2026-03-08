// Pure helpers for interpreting mixed AI responses in the vocabulary generator.
import type {
  QuizResult,
  WordResult,
} from "@/components/admin/ai-hub/vocabulary-generator/types";

export const getRequestedCount = (input: string) => {
  const match = input.match(/(\d+)/);
  if (!match) return null;

  const value = Number.parseInt(match[1], 10);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.min(value, 50);
};

export const isWordResult = (value: unknown): value is WordResult =>
  Boolean(
    value &&
      typeof value === "object" &&
      "word" in value &&
      typeof (value as WordResult).word === "string"
  );

export const isQuizResult = (value: unknown): value is QuizResult =>
  Boolean(
    value &&
      typeof value === "object" &&
      Array.isArray((value as QuizResult).questions)
  );

export const getWordItems = (resultData: unknown) => {
  if (!resultData) return null;
  if (Array.isArray(resultData)) {
    const items = resultData.filter(isWordResult);
    return items.length ? items : null;
  }
  if (isWordResult(resultData)) {
    return [resultData];
  }
  return null;
};

export const getQuizData = (resultData: unknown) => {
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
};
