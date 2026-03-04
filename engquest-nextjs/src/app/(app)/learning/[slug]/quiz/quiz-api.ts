import type {
  ProgressProofResponse,
  QuizDetailResponse,
  QuizListItem,
} from "./quiz-types";

export const fetchQuizList = async (slug: string) => {
  const response = await fetch(`/api/quizzes?slug=${slug}&list=1`, {
    cache: "no-store",
  });
  const payload = (await response.json()) as {
    data?: QuizListItem[];
    message?: string;
  };

  if (!response.ok) {
    throw new Error(payload.message ?? "Không thể tải danh sách quiz.");
  }

  return payload.data ?? [];
};

export const fetchQuizDetail = async (slug: string, quizId: string) => {
  const query = new URLSearchParams({
    slug,
    quizId,
  });
  const response = await fetch(`/api/quizzes?${query.toString()}`, {
    cache: "no-store",
  });
  const payload = (await response.json()) as QuizDetailResponse;

  if (!response.ok) {
    throw new Error(payload.message ?? "Không thể tải quiz.");
  }

  return payload.data;
};

export const saveQuizProgress = async (slug: string) => {
  const proofResponse = await fetch("/api/progress/proof", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "quiz", category_slug: slug }),
  });
  const proofPayload = (await proofResponse.json()) as ProgressProofResponse;
  if (!proofResponse.ok) {
    throw new Error(
      proofPayload.message ?? "Không thể xác thực tiến trình học."
    );
  }

  const proof = proofPayload.data?.proof;
  const resolvedCategoryId = proofPayload.data?.category_id;
  if (!proof || typeof proof !== "string") {
    throw new Error("Không thể xác thực tiến trình học.");
  }
  if (!resolvedCategoryId || typeof resolvedCategoryId !== "string") {
    throw new Error("Danh mục học không hợp lệ.");
  }

  const response = await fetch("/api/progress/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category_slug: slug,
      category_id: resolvedCategoryId,
      proof,
    }),
  });
  const payload = (await response.json()) as {
    data?: { progress?: number };
    message?: string;
  };

  if (!response.ok) {
    throw new Error(payload.message ?? "Không thể cập nhật tiến độ.");
  }

  return payload.data?.progress ?? 0;
};
