import type { VocabularyItem } from "./types";

type VocabularyPayload = { data?: VocabularyItem[]; message?: string };

export const fetchVocabularies = async () => {
  const response = await fetch("/api/admin/vocabularies", {
    cache: "no-store",
  });
  const payload = (await response.json()) as VocabularyPayload;
  if (!response.ok) {
    throw new Error(payload.message ?? "Unable to refresh vocabularies.");
  }
  return payload.data ?? [];
};

export const upsertVocabulary = async ({
  editingId,
  payload,
}: {
  editingId?: string;
  payload: unknown;
}) => {
  const endpoint = editingId
    ? `/api/admin/vocabularies/${editingId}`
    : "/api/admin/vocabularies";
  const method = editingId ? "PUT" : "POST";

  const response = await fetch(endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as { message?: string };
  if (!response.ok) {
    throw new Error(result.message ?? "Thao tác thất bại.");
  }
};

export const removeVocabulary = async (id: string) => {
  const response = await fetch(`/api/admin/vocabularies/${id}`, {
    method: "DELETE",
  });

  const result = (await response.json()) as { message?: string };
  if (!response.ok) {
    throw new Error(result.message ?? "Xóa thất bại.");
  }
};
