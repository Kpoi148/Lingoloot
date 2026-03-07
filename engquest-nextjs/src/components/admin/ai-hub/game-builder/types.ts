// Shared TypeScript types for the admin AI game builder.
export type CategoryOption = {
  _id: string;
  name: string;
  slug: string;
};

export type VocabularyItem = {
  _id: string;
  word: string;
  meaning: string;
  category_id?: string;
  category?: {
    name?: string;
    slug?: string;
  };
};

export type Difficulty = "easy" | "medium" | "hard";

export type ContentItem = {
  text: string;
  type: "text" | "gap";
  answer?: string;
};

export type Game = {
  title: string;
  content: ContentItem[];
  distractors: string[];
};

export type SaveState = {
  status: "idle" | "success" | "error";
  message: string;
};
