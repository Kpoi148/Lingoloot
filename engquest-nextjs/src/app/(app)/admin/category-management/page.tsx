"use client";
// Admin page for managing learning categories and topic structure.

import { useEffect, useMemo, useState } from "react";

type CategoryItem = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  order: number;
  count?: number;
};

type ToastState = {
  message: string;
  type: "success" | "error";
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image_url: "",
  order: "0",
  count: "",
};

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", slug: "" });
  const [toast, setToast] = useState<ToastState | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState({ ...emptyForm });
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesName = item.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const matchesSlug = item.slug
        .toLowerCase()
        .includes(filters.slug.toLowerCase());
      return matchesName && matchesSlug;
    });
  }, [items, filters]);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/categories", {
          cache: "no-store",
        });
        const payload = (await response.json()) as { data?: CategoryItem[] };

        if (!response.ok) {
          throw new Error("Unable to load categories.");
        }

        if (active) {
          setItems(payload.data ?? []);
        }
      } catch (error) {
        setToast({
          message:
            error instanceof Error ? error.message : "Unable to load categories.",
          type: "error",
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormState({ ...emptyForm });
    setModalOpen(true);
  };

  const openEditModal = (item: CategoryItem) => {
    setEditingItem(item);
    setFormState({
      name: item.name,
      slug: item.slug,
      description: item.description ?? "",
      image_url: item.image_url ?? "",
      order: String(item.order),
      count: item.count !== undefined ? String(item.count) : "",
    });
    setModalOpen(true);
  };

  const refreshItems = async () => {
    const response = await fetch("/api/admin/categories", {
      cache: "no-store",
    });
    const payload = (await response.json()) as { data?: CategoryItem[] };
    if (response.ok) {
      setItems(payload.data ?? []);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name.trim() || !formState.slug.trim()) {
      setToast({ message: "Vui lòng nhập tên và slug.", type: "error" });
      return;
    }

    const payload = {
      name: formState.name.trim(),
      slug: formState.slug.trim(),
      description: formState.description.trim(),
      image_url: formState.image_url.trim(),
      order: Number(formState.order),
      count: formState.count ? Number(formState.count) : undefined,
    };

    const endpoint = editingItem
      ? `/api/admin/categories/${editingItem._id}`
      : "/api/admin/categories";
    const method = editingItem ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setToast({ message: result.message ?? "Thao tác thất bại.", type: "error" });
      return;
    }

    await refreshItems();
    setToast({
      message: editingItem ? "Cập nhật thành công." : "Đã thêm chủ đề.",
      type: "success",
    });
    setModalOpen(false);
  };

  const handleDelete = async (item: CategoryItem) => {
    if (!confirm(`Xóa chủ đề "${item.name}"?`)) {
      return;
    }

    const response = await fetch(`/api/admin/categories/${item._id}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setToast({ message: result.message ?? "Xóa thất bại.", type: "error" });
      return;
    }

    await refreshItems();
    setToast({ message: "Đã xóa chủ đề.", type: "success" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Quản lý chủ đề
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sắp xếp chủ đề hiển thị cho người học.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openCreateModal}
            className="h-11 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-100 dark:text-slate-900 dark:shadow-slate-100/20"
          >
            Thêm chủ đề
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-white text-xs uppercase tracking-[0.25em] text-slate-400 shadow-sm dark:bg-slate-900 dark:text-slate-500">
              <tr className="bg-slate-50/80 text-[10px] normal-case text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                <th className="px-3 py-3">
                  <input
                    value={filters.name}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Filter Name"
                    className="h-8 w-full rounded-xl border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-slate-600"
                  />
                </th>
                <th className="px-3 py-3">
                  <input
                    value={filters.slug}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="Filter Slug"
                    className="h-8 w-full rounded-xl border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-slate-600"
                  />
                </th>
                <th className="px-3 py-3"></th>
                <th className="px-3 py-3"></th>
                <th className="px-3 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setFilters({ name: "", slug: "" })}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                  >
                    Clear
                  </button>
                </th>
              </tr>
              <tr>
                <th className="py-3 px-3">Chủ đề</th>
                <th className="py-3 px-3">Slug</th>
                <th className="py-3 px-3">Thứ tự</th>
                <th className="py-3 px-3">Từ vựng</th>
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
                    Chưa có chủ đề nào.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td className="py-4">
                      <p className="font-medium text-slate-900 dark:text-slate-200">{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.description ?? "Chưa có mô tả"}
                      </p>
                    </td>
                    <td className="py-4 text-slate-600 dark:text-slate-400">{item.slug}</td>
                    <td className="py-4 text-slate-600 dark:text-slate-400">{item.order}</td>
                    <td className="py-4 text-slate-600 dark:text-slate-400">
                      {item.count ?? 0}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                        >
                          Sửa
                        </button>
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {editingItem ? "Sửa chủ đề" : "Thêm chủ đề"}
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
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Tên chủ đề
                  </label>
                  <input
                    value={formState.name}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Giao thông"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Slug
                  </label>
                  <input
                    value={formState.slug}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        slug: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="giao-thong"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Mô tả
                </label>
                <textarea
                  value={formState.description}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  className="min-h-[96px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="Mô tả ngắn về chủ đề."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Image URL
                  </label>
                  <input
                    value={formState.image_url}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        image_url: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Thứ tự
                  </label>
                  <input
                    type="number"
                    value={formState.order}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        order: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Số từ
                  </label>
                  <input
                    type="number"
                    value={formState.count}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        count: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="20"
                  />
                </div>
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
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 dark:bg-slate-100 dark:text-slate-900"
                >
                  {editingItem ? "Lưu thay đổi" : "Thêm chủ đề"}
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
