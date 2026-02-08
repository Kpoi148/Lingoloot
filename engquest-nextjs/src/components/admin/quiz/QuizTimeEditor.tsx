"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type QuizTimeEditorProps = {
  quizId: string;
  initialTimeLimit: number;
};

export default function QuizTimeEditor({
  quizId,
  initialTimeLimit,
}: QuizTimeEditorProps) {
  const router = useRouter();
  const [timeLimit, setTimeLimit] = useState(initialTimeLimit.toString());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setTimeLimit(initialTimeLimit.toString());
  }, [initialTimeLimit]);

  const handleSave = async () => {
    const parsed = Number.parseInt(timeLimit, 10);
    if (!Number.isFinite(parsed)) {
      setMessage("Vui lòng nhập thời gian hợp lệ.");
      return;
    }
    if (parsed < 30 || parsed > 3600) {
      setMessage("Thời gian phải từ 30 đến 3600 giây.");
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeLimit: parsed }),
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Không thể cập nhật thời gian.");
      }

      setMessage("Đã cập nhật thời gian.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể cập nhật thời gian."
      );
    } finally {
      setSaving(false);
    }
  };

  const isUnchanged =
    Number.parseInt(timeLimit, 10) === Math.round(initialTimeLimit);

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <input
        type="number"
        min={30}
        max={3600}
        value={timeLimit}
        onChange={(event) => setTimeLimit(event.target.value)}
        className="h-10 w-36 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none"
        placeholder="120"
      />
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Giây
      </span>
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || isUnchanged}
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Đang lưu..." : "Cập nhật"}
      </button>
      {message && (
        <span className="text-xs font-semibold text-slate-500">{message}</span>
      )}
    </div>
  );
}
