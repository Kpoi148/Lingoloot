"use client";
// Admin modal for creating or editing vocabulary entries in place.

import dynamic from "next/dynamic";
import type { FormEvent, Dispatch, SetStateAction } from "react";
import type {
  CategoryOption,
  VocabularyFormState,
  VocabularyItem,
} from "./types";

const MediaUploader = dynamic(() => import("@/components/common/MediaUploader"), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full animate-pulse rounded-2xl border border-dashed border-slate-200 bg-slate-50" />
  ),
});

type VocabularyEditorModalProps = {
  categories: CategoryOption[];
  editingItem: VocabularyItem | null;
  formState: VocabularyFormState;
  setFormState: Dispatch<SetStateAction<VocabularyFormState>>;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export default function VocabularyEditorModal({
  categories,
  editingItem,
  formState,
  setFormState,
  onClose,
  onSubmit,
}: VocabularyEditorModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {editingItem ? "Sửa từ vựng" : "Thêm từ mới"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-400"
          >
            Đóng
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="/ˈbaɪ.sɪ.kəl/"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Meaning
            </label>
            <textarea
              value={formState.meaning}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  meaning: event.target.value,
                }))
              }
              rows={3}
              className="min-h-[90px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Xe đạp"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Example
              </label>
              <textarea
                value={formState.example}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    example: event.target.value,
                  }))
                }
                rows={3}
                className="min-h-[90px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="I ride a bicycle to work."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Example Meaning
              </label>
              <textarea
                value={formState.example_meaning}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    example_meaning: event.target.value,
                  }))
                }
                rows={3}
                className="min-h-[90px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Tôi đi làm bằng xe đạp."
              />
            </div>
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
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Chọn chủ đề</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Image
              </label>
              <MediaUploader
                mediaType="image"
                initialValue={formState.image}
                onUploadComplete={(url) =>
                  setFormState((prev) => ({ ...prev, image: url }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Video
              </label>
              <MediaUploader
                mediaType="video"
                initialValue={formState.video}
                onUploadComplete={(url) =>
                  setFormState((prev) => ({ ...prev, video: url }))
                }
              />
            </div>
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
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 dark:bg-slate-100 dark:text-slate-900"
            >
              {editingItem ? "Lưu thay đổi" : "Thêm từ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
