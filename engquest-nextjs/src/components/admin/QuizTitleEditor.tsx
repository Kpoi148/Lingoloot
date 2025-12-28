"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type QuizTitleEditorProps = {
  quizId: string;
  initialTitle: string;
};

export default function QuizTitleEditor({
  quizId,
  initialTitle,
}: QuizTitleEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setMessage("Vui lòng nhập tên quiz.");
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Không thể cập nhật tên quiz.");
      }

      setMessage("Đã cập nhật tên quiz.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể cập nhật tên quiz."
      );
    } finally {
      setSaving(false);
    }
  };

  const isUnchanged = title.trim() === initialTitle.trim();

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="h-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none"
        placeholder="Nhập tên quiz"
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || isUnchanged}
        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Đang lưu..." : "Cập nhật"}
      </button>
      {message && (
        <span className="text-xs font-semibold text-slate-500">{message}</span>
      )}
    </div>
  );
}
