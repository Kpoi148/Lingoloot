"use client";
// Admin page for browsing and managing quiz content.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type QuizItem = {
  _id: string;
  title: string;
  category: string;
  level?: string;
  timeLimit?: number;
  questionCount: number;
  createdAt?: string;
};

type ToastState = {
  message: string;
  type: "success" | "error";
};

const levels = ["Cơ bản", "Trung bình", "Khó"] as const;

const emptyForm = {
  title: "",
  timeLimit: "120",
  category: "",
  level: "Trung bình" as (typeof levels)[number],
};

export default function AdminQuizzesPage() {
  const [items, setItems] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ title: "", category: "", level: "" });
  const [toast, setToast] = useState<ToastState | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QuizItem | null>(null);
  const [formState, setFormState] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTitle = item.title
        .toLowerCase()
        .includes(filters.title.toLowerCase());
      const matchesCategory = item.category
        .toLowerCase()
        .includes(filters.category.toLowerCase());
      const matchesLevel =
        filters.level === "" || item.level === filters.level;

      return matchesTitle && matchesCategory && matchesLevel;
    });
  }, [items, filters]);

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

  const openEditModal = (item: QuizItem) => {
    setEditingItem(item);
    setFormState({
      title: item.title,
      timeLimit: String(item.timeLimit ?? 120),
      category: item.category,
      level: (item.level as (typeof levels)[number]) ?? "Trung bình",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingItem) return;

    const trimmedTitle = formState.title.trim();
    const parsedTime = Number.parseInt(formState.timeLimit, 10);

    if (!trimmedTitle) {
      setToast({ message: "Vui lòng nhập tên quiz.", type: "error" });
      return;
    }

    if (!Number.isFinite(parsedTime) || parsedTime < 30 || parsedTime > 3600) {
      setToast({ message: "Thời gian phải từ 30 đến 3600 giây.", type: "error" });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/quizzes/${editingItem._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          timeLimit: parsedTime,
          level: formState.level,
        }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Không thể cập nhật quiz.");
      }

      await loadData();
      setToast({ message: "Đã cập nhật quiz.", type: "success" });
      setModalOpen(false);
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Không thể cập nhật quiz.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

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
          <Link
            href="/admin/quiz-management/create"
            className="flex h-11 items-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-100 dark:text-slate-900 dark:shadow-slate-100/20"
          >
            Tạo bài quiz
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-white text-xs uppercase tracking-[0.25em] text-slate-400 shadow-sm dark:bg-slate-900 dark:text-slate-500">
              <tr className="bg-slate-50/80 text-[10px] normal-case text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                <th className="px-3 py-3">
                  <input
                    value={filters.title}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Filter Title"
                    className="h-8 w-full rounded-xl border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-slate-600"
                  />
                </th>
                <th className="px-3 py-3">
                  <input
                    value={filters.category}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, category: e.target.value }))
                    }
                    placeholder="Filter Category"
                    className="h-8 w-full rounded-xl border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-slate-600"
                  />
                </th>
                <th className="px-3 py-3">
                  <select
                    value={filters.level}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, level: e.target.value }))
                    }
                    className="h-8 w-full rounded-xl border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-slate-600"
                  >
                    <option value="">All Levels</option>
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </th>
                <th className="px-3 py-3"></th>
                <th className="px-3 py-3 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({ title: "", category: "", level: "" })
                    }
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                  >
                    Clear
                  </button>
                </th>
              </tr>
              <tr>
                <th className="py-3 px-3">Tên quiz</th>
                <th className="py-3 px-3">Chủ đề</th>
                <th className="py-3 px-3">Mức độ</th>
                <th className="py-3 px-3">Số câu</th>
                <th className="py-3 px-3 text-right">Tác vụ</th>
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
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                        >
                          Sửa
                        </button>
                        <Link
                          href={`/admin/quiz-management/${item._id}`}
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

      {/* Edit Modal */}
      {modalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Chỉnh sửa Quiz
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-400"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Tên Quiz
                </label>
                <input
                  value={formState.title}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="Quiz giao thông"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Thời gian (giây)
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={3600}
                    value={formState.timeLimit}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, timeLimit: event.target.value }))
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="120"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Mức độ
                  </label>
                  <select
                    value={formState.level}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        level: event.target.value as (typeof levels)[number],
                      }))
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Chủ đề
                </label>
                <input
                  value={formState.category}
                  disabled
                  className="h-11 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                />
                <p className="text-xs text-slate-500">Không thể thay đổi chủ đề sau khi tạo.</p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-100 dark:text-slate-900"
                >
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
