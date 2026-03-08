// Client-side API helper for loading dictionary meanings during gameplay.
export const loadStoryClozeMeaning = async (word: string) => {
  const response = await fetch(
    `/api/dictionary/meaning?word=${encodeURIComponent(word)}`,
    { cache: "no-store" }
  );

  const payload = (await response.json()) as {
    data?: { meaning?: string };
    message?: string;
  };

  if (!response.ok) {
    throw new Error(payload.message ?? "Không thể dịch từ.");
  }

  const meaning = payload.data?.meaning?.trim() ?? "";
  if (!meaning) {
    throw new Error("Không tìm thấy nghĩa.");
  }

  return meaning;
};
