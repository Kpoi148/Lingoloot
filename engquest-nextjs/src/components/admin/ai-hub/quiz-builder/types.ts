// Shared TypeScript types for the admin AI quiz builder.
export const defaultPrompt =
  "Generate a multiple-choice quiz. Explanation language: Vietnamese.";

export const presets = [
  {
    label: "Hard Mode",
    value: "Create difficult questions with tricky distractors.",
  },
  { label: "Fun Mode", value: "Use funny and humorous examples." },
  { label: "Kid Mode", value: "Use simple words for children." },
] as const;

export const levels = ["Cơ bản", "Trung bình", "Khó"] as const;

export type CategoryOption = {
  _id: string;
  name: string;
  slug: string;
};

export type VocabularyItem = {
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

export type EditableQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type EditableQuiz = {
  title: string;
  questions: EditableQuestion[];
};
