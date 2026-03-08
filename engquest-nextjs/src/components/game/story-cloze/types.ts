// Local data contracts for the Story Cloze gameplay feature.
export type StoryClozeContentItem = {
  text: string;
  type: "text" | "gap";
  answer?: string;
};

export type StoryClozeGameData = {
  id: string;
  title: string;
  content: StoryClozeContentItem[];
  distractors: string[];
};

export type StoryClozeStatus = "playing" | "checking" | "completed";

export type StoryClozeFeedback = "correct" | "wrong" | null;

export type StoryClozeBankItem = {
  id: string;
  word: string;
};

export type StoryClozeGap = {
  id: string;
  answer: string;
};

export type StoryClozeMeaningSelection = {
  word: string;
  meaning: string;
};

export type StoryClozeToken = {
  value: string;
  isWord: boolean;
};
