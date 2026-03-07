"use client";
// Admin client surface for browsing, editing, and filtering vocabulary entries.

import { useEffect, useMemo, useState } from "react";
import {
  fetchVocabularies,
  removeVocabulary,
  upsertVocabulary,
} from "./admin-vocabulary/api";
import {
  emptyFilters,
  emptyForm,
  type CategoryOption,
  type VocabularyFilters,
  type VocabularyFormState,
  type ToastState,
  type VocabularyItem,
} from "./admin-vocabulary/types";
import {
  buildVocabularyPayload,
  isVocabularyFormValid,
  mapVocabularyToFormState,
} from "./admin-vocabulary/form-utils";
import {
  filterVocabularies,
  getPagedItems,
} from "./admin-vocabulary/utils";
import VocabularyEditorModal from "./admin-vocabulary/VocabularyEditorModal";

export type { CategoryOption, VocabularyItem };

type AdminVocabulariesClientProps = {
  initialItems: VocabularyItem[];
  initialCategories: CategoryOption[];
  initialError?: string | null;
};

export default function AdminVocabulariesClient({
  initialItems,
  initialCategories,
  initialError = null,
}: AdminVocabulariesClientProps) {
  const [items, setItems] = useState<VocabularyItem[]>(initialItems);
  const [categories] = useState<CategoryOption[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<VocabularyFilters>({ ...emptyFilters });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [toast, setToast] = useState<ToastState | null>(() =>
    initialError ? { message: initialError, type: "error" } : null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState<VocabularyFormState>({
    ...emptyForm,
  });
  const [editingItem, setEditingItem] = useState<VocabularyItem | null>(null);
  const skeletonRows = useMemo(
    () => Array.from({ length: Math.min(pageSize, 10) }),
    [pageSize]
  );

  const filteredItems = useMemo(
    () => filterVocabularies(items, search, filters),
    [items, search, filters]
  );

  const { totalItems, totalPages, currentPage, pagedItems } = useMemo(
    () => getPagedItems(filteredItems, page, pageSize),
    [filteredItems, page, pageSize]
  );

  useEffect(() => {
    setPage(1);
  }, [
    search,
    filters.word,
    filters.meaning,
    filters.example,
    filters.categoryId,
    pageSize,
  ]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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

  const openEditModal = (item: VocabularyItem) => {
    setEditingItem(item);
    setFormState(mapVocabularyToFormState(item));
    setModalOpen(true);
  };

  const refreshItems = async () => {
    setLoading(true);
    try {
      const latestItems = await fetchVocabularies();
      setItems(latestItems);
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Unable to refresh data.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isVocabularyFormValid(formState)) {
      setToast({ message: "Vui lòng nhập đầy đủ thông tin.", type: "error" });
      return;
    }

    const payload = buildVocabularyPayload(formState);

    const endpoint = editingItem
      ? editingItem._id
      : undefined;

    try {
      await upsertVocabulary({ editingId: endpoint, payload });
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Thao tác thất bại.",
        type: "error",
      });
      return;
    }

    await refreshItems();
    setToast({
      message: editingItem ? "Cập nhật thành công." : "Đã thêm từ mới.",
      type: "success",
    });
    setModalOpen(false);
  };

  const handleDelete = async (item: VocabularyItem) => {
    if (!confirm(`Xóa từ vựng "${item.word}"?`)) {
      return;
    }

    try {
      await removeVocabulary(item._id);
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Xóa thất bại.",
        type: "error",
      });
      return;
    }

    await refreshItems();
    setToast({ message: "Đã xóa từ vựng.", type: "success" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Quản lý từ vựng
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Theo dõi, thêm mới và chỉnh sửa từ vựng theo chủ đề.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo từ..."
            className="h-11 w-56 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-700"
          />
          <button
            type="button"
            onClick={openCreateModal}
            className="h-11 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-100 dark:text-slate-900 dark:shadow-slate-100/20"
          >
            Thêm từ mới
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Hiển thị{" "}
            {totalItems ? (currentPage - 1) * pageSize + 1 : 0} -{" "}
            {Math.min(currentPage * pageSize, totalItems)} trên {totalItems}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span>Số dòng</span>
              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                {[10, 20, 30, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage <= 1}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                Trước
              </button>
              <span>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage >= totalPages}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                Sau
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-[65vh] min-h-[520px] overflow-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-white text-xs uppercase tracking-[0.25em] text-slate-400 shadow-sm dark:bg-slate-900 dark:text-slate-500">
              <tr className="bg-slate-50/80 text-[10px] normal-case text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                <th className="px-3 py-3">
                  <input
                    value={filters.word}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        word: event.target.value,
                      }))
                    }
                    placeholder="Lọc từ"
                    className="h-9 w-full rounded-2xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-slate-600"
                  />
                </th>
                <th className="px-3 py-3">
                  <input
                    value={filters.meaning}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        meaning: event.target.value,
                      }))
                    }
                    placeholder="Lọc nghĩa"
                    className="h-9 w-full rounded-2xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-slate-600"
                  />
                </th>
                <th className="px-3 py-3">
                  <input
                    value={filters.example}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        example: event.target.value,
                      }))
                    }
                    placeholder="Lọc ví dụ"
                    className="h-9 w-full rounded-2xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-slate-600"
                  />
                </th>
                <th className="px-3 py-3">
                  <select
                    value={filters.categoryId}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        categoryId: event.target.value,
                      }))
                    }
                    className="h-9 w-full rounded-2xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-slate-600"
                  >
                    <option value="">Tất cả chủ đề</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </th>
                <th className="px-3 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setFilters({ ...emptyFilters })}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                  >
                    Xóa lọc
                  </button>
                </th>
              </tr>
              <tr>
                <th className="px-3 py-3">Từ</th>
                <th className="px-3 py-3">Nghĩa</th>
                <th className="px-3 py-3">Ví dụ</th>
                <th className="px-3 py-3">Chủ đề</th>
                <th className="px-3 py-3 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading &&
                skeletonRows.map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    <td className="px-3 py-4">
                      <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800" />
                    </td>
                    <td className="px-3 py-4">
                      <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800" />
                    </td>
                    <td className="px-3 py-4">
                      <div className="h-4 w-48 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800" />
                    </td>
                    <td className="px-3 py-4">
                      <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800" />
                    </td>
                    <td className="px-3 py-4">
                      <div className="ml-auto h-6 w-24 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800" />
                    </td>
                  </tr>
                ))}

              {!loading && filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 dark:text-slate-500">
                    Chưa có từ vựng nào.
                  </td>
                </tr>
              )}

              {!loading &&
                pagedItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-3 py-4 font-medium text-slate-900 dark:text-slate-200">
                      {item.word}
                    </td>
                    <td className="px-3 py-4 text-slate-600 dark:text-slate-400">
                      <span className="block max-w-[200px] truncate" title={item.meaning}>
                        {item.meaning}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-slate-600 dark:text-slate-400">
                      {item.example ? (
                        <div className="space-y-1">
                          <p
                            className="max-w-[240px] truncate text-sm text-slate-700 dark:text-slate-300"
                            title={item.example}
                          >
                            {item.example}
                          </p>
                          {item.example_meaning && (
                            <p
                              className="max-w-[240px] truncate text-xs text-slate-500 dark:text-slate-500"
                              title={item.example_meaning}
                            >
                              {item.example_meaning}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-600">--</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-slate-600 dark:text-slate-400">
                      {item.category?.name ?? "Chưa xác định"}
                    </td>
                    <td className="px-3 py-4 text-right">
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
        <VocabularyEditorModal
          categories={categories}
          editingItem={editingItem}
          formState={formState}
          setFormState={setFormState}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
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
