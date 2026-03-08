// Client-side API helpers for loading categories, generating content, and saving words.
import type {
  CategoryOption,
  WordResult,
} from "@/components/admin/ai-hub/vocabulary-generator/types";

export const loadVocabularyCategories = async () => {
  const response = await fetch("/api/admin/categories", {
    cache: "no-store",
  });
  const payload = (await response.json()) as {
    data?: CategoryOption[];
    message?: string;
  };

  if (!response.ok) {
    throw new Error(payload.message ?? "Không thể tải chủ đề.");
  }

  return payload.data ?? [];
};

export const generateVocabularyContent = async ({
  prompt,
  level,
  requestedCount,
}: {
  prompt: string;
  level: string;
  requestedCount: number | null;
}) => {
  const countInstruction = requestedCount
    ? `\nReturn exactly ${requestedCount} word objects. Do not add extra words.`
    : "";

  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `${prompt}\nLevel: ${level}${countInstruction}`,
      type: "auto",
    }),
  });

  const payload = (await response.json()) as {
    success?: boolean;
    data?: unknown;
    error?: string;
  };

  if (!response.ok || !payload.success) {
    throw new Error(payload.error ?? "Không thể tạo nội dung.");
  }

  const resultData = payload.data ?? null;
  if (requestedCount && Array.isArray(resultData)) {
    return resultData.slice(0, requestedCount);
  }

  return resultData;
};

export const saveVocabularyWord = async (
  item: WordResult,
  categoryId: string
) => {
  const response = await fetch("/api/admin/vocabularies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      word: item.word,
      ipa: item.ipa ?? "",
      meaning: item.meaning ?? "",
      example: item.example ?? "",
      example_meaning: item.example_meaning ?? "",
      category_id: categoryId,
      media: {},
    }),
  });

  const payload = (await response.json()) as { message?: string };
  if (!response.ok) {
    throw new Error(payload.message ?? "Lưu dữ liệu thất bại.");
  }
};
