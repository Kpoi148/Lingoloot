import type { CategoryOption, Difficulty, Game, VocabularyItem } from "./types";

export const loadGameBuilderData = async () => {
  const [categoryRes, vocabRes] = await Promise.all([
    fetch("/api/admin/categories", { cache: "no-store" }),
    fetch("/api/admin/vocabularies", { cache: "no-store" }),
  ]);

  const categoryPayload = (await categoryRes.json()) as {
    data?: CategoryOption[];
    message?: string;
  };
  const vocabPayload = (await vocabRes.json()) as {
    data?: VocabularyItem[];
    message?: string;
  };

  if (!categoryRes.ok) {
    throw new Error(categoryPayload.message ?? "Unable to load categories.");
  }

  if (!vocabRes.ok) {
    throw new Error(vocabPayload.message ?? "Unable to load vocabularies.");
  }

  return {
    categories: categoryPayload.data ?? [],
    vocabularies: vocabPayload.data ?? [],
  };
};

export const generateGameWithAi = async ({
  topicName,
  difficulty,
  vocabularyList,
}: {
  topicName: string;
  difficulty: Difficulty;
  vocabularyList: Array<{ word: string; meaning: string }>;
}) => {
  const response = await fetch("/api/admin/games/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topicName,
      difficulty,
      vocabularyList,
    }),
  });

  const payload = (await response.json()) as { message?: string; data?: Game };
  if (!response.ok) {
    throw new Error(payload.message ?? "Unable to generate game.");
  }

  return payload.data ?? (payload as unknown as Game);
};

export const saveGameToDatabase = async (game: Game, topicName: string) => {
  const response = await fetch("/api/admin/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...game,
      topicName: topicName.trim(),
      status: "active",
    }),
  });

  let payloadBody: { message?: string } | null = null;
  try {
    payloadBody = (await response.json()) as { message?: string };
  } catch {
    payloadBody = null;
  }

  if (!response.ok) {
    throw new Error(payloadBody?.message ?? "Unable to save game.");
  }
};

export const loadDictionaryMeaning = async (word: string) => {
  const response = await fetch(
    `/api/dictionary/meaning?word=${encodeURIComponent(word)}`,
    { cache: "no-store" }
  );
  const payload = (await response.json()) as {
    data?: { word?: string; meaning?: string };
    message?: string;
  };

  if (!response.ok) {
    throw new Error(payload.message ?? "Unable to fetch meaning.");
  }

  const meaning = payload.data?.meaning?.trim() ?? "";
  if (!meaning) {
    throw new Error("Meaning not found.");
  }

  return meaning;
};
