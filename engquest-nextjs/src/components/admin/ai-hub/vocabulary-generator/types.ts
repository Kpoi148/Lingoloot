// Local contracts for the AI vocabulary generator feature.
export type CategoryOption = {
  _id: string;
  name: string;
  slug?: string;
};

export type WordResult = {
  word: string;
  ipa?: string;
  meaning?: string;
  example?: string;
  example_meaning?: string;
};

export type QuizQuestion = {
  question?: string;
  prompt?: string;
  options?: string[];
  choices?: string[];
};

export type QuizResult = {
  title?: string;
  questions?: QuizQuestion[];
};

export const vocabularyLevels = ["Cơ bản", "Trung bình", "Khó"] as const;
