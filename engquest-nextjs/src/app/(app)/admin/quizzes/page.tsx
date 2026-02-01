"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type QuizItem = {
  _id: string;
  title: string;
  category: string;
  level?: string;
  questionCount: number;
  createdAt?: string;
};

type ToastState = {
  message: string;
  type: "success" | "error";
};

export default function AdminQuizzesPage() {
  const [items, setItems] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const needle = search.trim().toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(needle) ||
        item.category.toLowerCase().includes(needle) ||
        (item.level ?? "").toLowerCase().includes(needle)
    );
  }, [items, search]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/quizzes", { cache: "no-store" });
      const payload = (await response.json()) as { data?: QuizItem[]; message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Không thể tải danh sách quiz.");
      }

      setItems(payload.data ?? []);
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Không thể tải danh sách quiz.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleDelete = async (item: QuizItem) => {
    if (!confirm(`Xóa quiz "${item.title}"?`)) {
      return;
    }

    const response = await fetch(`/api/admin/quizzes/${item._id}`, {
      method: "DELETE",
    });
    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setToast({ message: payload.message ?? "Xóa thất bại.", type: "error" });
      return;
    }

    await loadData();
    setToast({ message: "Đã xóa quiz.", type: "success" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Quản lý bài tập Quiz
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Theo dõi và chỉnh sửa các bài tập trắc nghiệm.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tên hoặc chủ đề..."
            className="h-11 w-64 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-700"
          />
          <Link
            href="/admin/quizzes/create"
            className="flex h-11 items-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-100 dark:text-slate-900 dark:shadow-slate-100/20"
          >
            Tạo bài quiz
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              <tr>
                <th className="py-3">Tên quiz</th>
                <th className="py-3">Chủ đề</th>
                <th className="py-3">Mức độ</th>
                <th className="py-3">Số câu</th>
                <th className="py-3 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 dark:text-slate-500">
                    Đang tải...
                  </td>
                </tr>
              )}

              {!loading && filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 dark:text-slate-500">
                    Chưa có quiz nào.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td className="py-4 font-medium text-slate-900 dark:text-slate-200">
                      {item.title}
                    </td>
                    <td className="py-4 text-slate-600 dark:text-slate-400">{item.category}</td>
                    <td className="py-4 text-slate-600 dark:text-slate-400">
                      {item.level ?? "Trung bình"}
                    </td>
                    <td className="py-4 text-slate-600 dark:text-slate-400">{item.questionCount}</td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/quizzes/${item._id}`}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                        >
                          Xem
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ${toast.type === "success"
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
            }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
