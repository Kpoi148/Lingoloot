export type CategoryOption = {
  _id: string;
  name: string;
};

export type VocabularyItem = {
  _id: string;
  word: string;
  ipa?: string;
  meaning: string;
  example?: string;
  example_meaning?: string;
  category_id: string;
  category?: { name?: string };
  media?: {
    image?: string;
    audio?: string;
    video?: string;
  };
};

export type ToastState = {
  message: string;
  type: "success" | "error";
};

export type VocabularyFilters = {
  word: string;
  meaning: string;
  example: string;
  categoryId: string;
};

export type VocabularyFormState = {
  word: string;
  ipa: string;
  meaning: string;
  example: string;
  example_meaning: string;
  category_id: string;
  image: string;
  audio: string;
  video: string;
};

export const emptyFilters: VocabularyFilters = {
  word: "",
  meaning: "",
  example: "",
  categoryId: "",
};

export const emptyForm: VocabularyFormState = {
  word: "",
  ipa: "",
  meaning: "",
  example: "",
  example_meaning: "",
  category_id: "",
  image: "",
  audio: "",
  video: "",
};
