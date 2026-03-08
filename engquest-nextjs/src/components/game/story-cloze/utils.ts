// Pure helpers for Story Cloze parsing, bank generation, and answer checking.
import type {
  StoryClozeBankItem,
  StoryClozeContentItem,
  StoryClozeGap,
  StoryClozeToken,
} from "@/components/game/story-cloze/types";

export const shuffle = <T,>(items: T[]) => {
  const cloned = [...items];
  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]];
  }
  return cloned;
};

export const splitIntoTokens = (text: string) => {
  const tokens: StoryClozeToken[] = [];
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

export const getStoryClozeGaps = (content: StoryClozeContentItem[]) =>
  content
    .map((item, index) =>
      item.type === "gap"
        ? { id: `gap-${index}`, answer: item.answer ?? item.text ?? "" }
        : null
    )
    .filter(Boolean) as StoryClozeGap[];

export const getStoryClozeAnswerSet = (gaps: StoryClozeGap[]) => {
  const answerSet = new Set<string>();
  gaps.forEach((gap) => {
    if (gap.answer) {
      answerSet.add(gap.answer.toLowerCase());
    }
  });
  return answerSet;
};

export const buildStoryClozeBankItems = (
  gaps: StoryClozeGap[],
  distractors: string[],
  bankSeed: number
) => {
  const answers = gaps.map((gap, index) => ({
    id: `answer-${index}-${bankSeed}`,
    word: gap.answer,
  }));
  const distractorItems = distractors.map((word, index) => ({
    id: `distractor-${index}-${bankSeed}`,
    word,
  }));
  return shuffle([...answers, ...distractorItems]);
};

export const buildFilledItemsMap = (items: StoryClozeBankItem[]) => {
  const filledItems = new Map<string, StoryClozeBankItem>();
  items.forEach((item) => filledItems.set(item.id, item));
  return filledItems;
};

export const getWrongGapIds = (
  gaps: StoryClozeGap[],
  userAnswers: Record<string, string>,
  filledItems: Map<string, StoryClozeBankItem>
) =>
  gaps
    .filter((gap) => {
      const itemId = userAnswers[gap.id];
      if (!itemId) return true;
      const item = filledItems.get(itemId);
      return !item || item.word.trim() !== gap.answer.trim();
    })
    .map((gap) => gap.id);
