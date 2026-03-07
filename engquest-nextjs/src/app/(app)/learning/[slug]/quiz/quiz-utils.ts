// Utility helpers for quiz scoring, shaping, and client-side flow control.
export const DEFAULT_TIME_LIMIT = 120;

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN");
};

export const getLevelLabel = (level?: string) => {
  if (level === "Cơ bản") return "Dễ";
  if (level === "Khó") return "Khó";
  return "Trung bình";
};

export const getLevelBadgeStyle = (level?: string) => {
  if (level === "Cơ bản") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (level === "Khó") {
    return "border-red-200 bg-red-50 text-red-700";
  }
  return "border-amber-200 bg-amber-50 text-amber-700";
};
