"use client";

import { useEffect, useMemo, useState } from "react";

type CategoryOption = {
  _id: string;
  name: string;
};

type VocabularyItem = {
  _id: string;
  word: string;
  ipa?: string;
  meaning: string;
  category_id: string;
  category?: { name?: string };
  media?: {
    image?: string;
    audio?: string;
    video?: string;
  };
};

type ToastState = {
  message: string;
  type: "success" | "error";
};

const emptyForm = {
  word: "",
  ipa: "",
  meaning: "",
  category_id: "",
  image: "",
  audio: "",
  video: "",
};

export default function AdminVocabulariesPage() {
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState({ ...emptyForm });
  const [editingItem, setEditingItem] = useState<VocabularyItem | null>(null);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const needle = search.trim().toLowerCase();
    return items.filter((item) => item.word.toLowerCase().includes(needle));
  }, [items, search]);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const [vocabRes, categoryRes] = await Promise.all([
          fetch("/api/admin/vocabularies", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        const vocabPayload = (await vocabRes.json()) as { data?: VocabularyItem[] };
        const categoryPayload = (await categoryRes.json()) as {
          data?: CategoryOption[];
        };

        if (!vocabRes.ok) {
          throw new Error("Unable to load vocabularies.");
        }

        if (!categoryRes.ok) {
          throw new Error("Unable to load categories.");
        }

        if (active) {
          setItems(vocabPayload.data ?? []);
          setCategories(categoryPayload.data ?? []);
        }
      } catch (error) {
        setToast({
          message:
            error instanceof Error ? error.message : "Unable to load data.",
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

  const openEditModal = (item: VocabularyItem) => {
    setEditingItem(item);
    setFormState({
      word: item.word,
      ipa: item.ipa ?? "",
      meaning: item.meaning,
      category_id: item.category_id,
      image: item.media?.image ?? "",
      audio: item.media?.audio ?? "",
      video: item.media?.video ?? "",
    });
    setModalOpen(true);
  };

  const refreshItems = async () => {
    const response = await fetch("/api/admin/vocabularies", {
      cache: "no-store",
    });
    const payload = (await response.json()) as { data?: VocabularyItem[] };
    if (response.ok) {
      setItems(payload.data ?? []);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.word.trim() || !formState.meaning.trim() || !formState.category_id) {
      setToast({ message: "Vui lòng nhập đầy đủ thông tin.", type: "error" });
      return;
    }

    const payload = {
      word: formState.word.trim(),
      ipa: formState.ipa.trim(),
      meaning: formState.meaning.trim(),
      category_id: formState.category_id,
      media: {
        image: formState.image.trim(),
        audio: formState.audio.trim(),
        video: formState.video.trim(),
      },
    };

    const endpoint = editingItem
      ? `/api/admin/vocabularies/${editingItem._id}`
      : "/api/admin/vocabularies";
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
      message: editingItem ? "Cập nhật thành công." : "Đã thêm từ mới.",
      type: "success",
    });
    setModalOpen(false);
  };

  const handleDelete = async (item: VocabularyItem) => {
    if (!confirm(`Xóa từ vựng "${item.word}"?`)) {
      return;
    }

    const response = await fetch(`/api/admin/vocabularies/${item._id}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setToast({ message: result.message ?? "Xóa thất bại.", type: "error" });
      return;
    }

    await refreshItems();
    setToast({ message: "Đã xóa từ vựng.", type: "success" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Quản lý từ vựng
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Theo dõi, thêm mới và chỉnh sửa từ vựng theo chủ đề.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo từ..."
            className="h-11 w-56 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={openCreateModal}
            className="h-11 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Thêm từ mới
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.25em] text-slate-400">
              <tr>
                <th className="py-3">Từ</th>
                <th className="py-3">Nghĩa</th>
                <th className="py-3">Chủ đề</th>
                <th className="py-3 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    Đang tải...
                  </td>
                </tr>
              )}

              {!loading && filteredItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    Chưa có từ vựng nào.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td className="py-4 font-medium text-slate-900">
                      {item.word}
                    </td>
                    <td className="py-4 text-slate-600">{item.meaning}</td>
                    <td className="py-4 text-slate-600">
                      {item.category?.name ?? "Chưa xác định"}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingItem ? "Sửa từ vựng" : "Thêm từ mới"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Word
                  </label>
                  <input
                    value={formState.word}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        word: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700"
                    placeholder="Bicycle"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    IPA
                  </label>
                  <input
                    value={formState.ipa}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        ipa: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700"
                    placeholder="/ˈbaɪ.sɪ.kəl/"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Meaning
                </label>
                <input
                  value={formState.meaning}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      meaning: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700"
                  placeholder="Xe đạp"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Category
                </label>
                <select
                  value={formState.category_id}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      category_id: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700"
                >
                  <option value="">Chọn chủ đề</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Image URL
                  </label>
                  <input
                    value={formState.image}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        image: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Audio URL
                  </label>
                  <input
                    value={formState.audio}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        audio: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Video URL
                  </label>
                  <input
                    value={formState.video}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        video: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20"
                >
                  {editingItem ? "Lưu thay đổi" : "Thêm từ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ${
            toast.type === "success"
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
