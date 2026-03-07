// Shared TypeScript types for the learner quiz page.
export type QuizQuestion = {
  question_text: string;
  options: string[];
  correct_answer: string;
};

export type QuizListItem = {
  _id: string;
  title: string;
  level?: string;
  questionCount: number;
  createdAt?: string;
};

export type QuizDetailResponse = {
  data?: {
    _id?: string;
    title?: string;
    category?: string;
    level?: string;
    timeLimit?: number;
    questions?: QuizQuestion[];
  };
  message?: string;
};

export type ProgressProofResponse = {
  data?: {
    proof?: string | null;
    category_id?: string;
  };
  message?: string;
};
