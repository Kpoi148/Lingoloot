// Formatting helpers for transforming Story Cloze builder data.
import type { CategoryOption, Game, VocabularyItem } from "./types";

export const getTopicVocabularies = (
  topic: string,
  selectedCategory: CategoryOption | undefined,
  vocabularies: VocabularyItem[]
) => {
  if (!topic.trim()) return [];
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

// This function chooses selected words when present, otherwise it falls back to the full topic vocabulary.
export const sanitizeVocabulary = (
  selectedWordIds: string[],
  selectedWords: VocabularyItem[],
  topicVocabularies: VocabularyItem[]
) => {
  const source = selectedWordIds.length > 0 ? selectedWords : topicVocabularies;
  return source
    .map((item) => ({
      word: item.word.trim(),
      meaning: item.meaning.trim(),
    }))
    .filter((item) => item.word && item.meaning);
};

export const splitIntoTokens = (text: string) => {
  const tokens: Array<{ value: string; isWord: boolean }> = [];
  const pattern = /[A-Za-z]+(?:['-][A-Za-z]+)*/g;
  let lastIndex = 0;
  let match = pattern.exec(text);
  while (match) {
    if (match.index > lastIndex) {
      tokens.push({
        value: text.slice(lastIndex, match.index),
        isWord: false,
      });
    }
    tokens.push({ value: match[0], isWord: true });
    lastIndex = match.index + match[0].length;
    match = pattern.exec(text);
  }
  if (lastIndex < text.length) {
    tokens.push({ value: text.slice(lastIndex), isWord: false });
  }
  return tokens;
};

// This function builds the preview bank from generated answers plus distractors.
export const getPreviewWordBank = (game: Game | null) => {
  if (!game) return [];
  const answers = game.content
    .map((item) => (item.type === "gap" ? item.answer ?? item.text ?? "" : ""))
    .filter(Boolean);
  return [...answers, ...game.distractors];
};

// This function normalizes answers into a lowercase set for case-insensitive preview matching.
export const getAnswerSet = (game: Game | null) => {
  const set = new Set<string>();
  if (!game) return set;
  game.content.forEach((item) => {
    if (item.type === "gap") {
      const answer = item.answer ?? item.text ?? "";
      if (answer) {
        set.add(answer.toLowerCase());
      }
    }
  });
  return set;
};
