"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type VocabularyMedia = {
  image?: string;
  video?: string;
  audio?: string;
};

type VocabularyItem = {
  _id: string;
  word: string;
  ipa?: string;
  meaning: string;
  example?: string;
  example_meaning?: string;
  media?: VocabularyMedia;
};

type CategoryInfo = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
};

type ApiResponse = {
  category?: CategoryInfo;
  data?: VocabularyItem[];
  message?: string;
};

function Flashcard({
  word,
  meaning,
  ipa,
  example,
  exampleMeaning,
  flipped,
  onToggle,
  imageUrl,
}: {
  word: string;
  meaning: string;
  ipa?: string;
  example?: string;
  exampleMeaning?: string;
  flipped: boolean;
  onToggle: () => void;
  imageUrl?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative h-72 w-full cursor-pointer rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-left shadow-xl shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{ perspective: "1200px" }}
      aria-pressed={flipped}
    >
      <div
        className="relative h-full w-full transition-transform duration-500"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div
          className="absolute inset-0 flex h-full w-full flex-col justify-between rounded-3xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="space-y-3">
            <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Flashcard
            </span>
            <h2 className="text-3xl font-semibold text-slate-900">{word}</h2>
            {ipa && <p className="text-sm text-slate-500">{ipa}</p>}
          </div>
          {imageUrl && (
            <div className="mt-6 h-24 w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
              <img
                src={imageUrl}
                alt={word}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          {!imageUrl && (
            <p className="mt-6 text-sm text-slate-500">
              Nhấn vào thẻ để xem nghĩa.
            </p>
          )}
        </div>

        <div
          className="absolute inset-0 flex h-full w-full flex-col justify-between overflow-y-auto overscroll-contain rounded-3xl bg-slate-900 px-6 py-6 pr-5 text-white"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="space-y-3">
            <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Meaning
            </span>
            <h2 className="text-2xl font-semibold">{meaning}</h2>
            {example && (
              <div className="space-y-1 text-sm text-white/80">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                  Example
                </p>
                <p>{example}</p>
                {exampleMeaning && (
                  <p className="text-xs text-white/60">{exampleMeaning}</p>
                )}
              </div>
            )}
          </div>
          <p className="text-sm text-white/70">
            Nhấn vào thẻ để quay lại từ vựng.
          </p>
        </div>
      </div>
    </button>
  );
}

export default function FlashcardsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [category, setCategory] = useState<CategoryInfo | null>(null);
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const { slug: resolvedSlug } = await params;
        if (!active) return;
        setSlug(resolvedSlug);
        const response = await fetch(`/api/vocabularies?slug=${resolvedSlug}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as ApiResponse;

        if (!response.ok) {
          throw new Error(data.message ?? "Unable to load vocabularies.");
        }

        if (active) {
          setCategory(data.category ?? null);
          setItems(data.data ?? []);
        }
      } catch (fetchError) {
        if (active) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load vocabularies."
          );
        }
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
  }, [params]);

  const currentItem = items[currentIndex];
  const total = items.length;
  const progressPercent = useMemo(() => {
    if (!total) return 0;
    return Math.round(((currentIndex + 1) / total) * 100);
  }, [currentIndex, total]);

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setFlipped(false);
    }
  };

  const handleAudio = () => {
    if (!currentItem) return;
    const audioUrl = currentItem.media?.audio;

    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => undefined);
      }
      return;
    }

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentItem.word);
      utterance.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleCompleteVocab = async () => {
    if (!category?._id) return;
    setSaving(true);
    try {
      const response = await fetch("/api/progress/vocab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_id: category._id }),
      });
      const payload = (await response.json()) as {
        data?: { progress?: number };
        message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message ?? "Không thể cập nhật tiến trình.");
      }

      setToast({
        message: `Đã ghi nhận tiến trình: ${payload.data?.progress ?? 0}%.`,
        type: "success",
      });
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Không thể cập nhật tiến trình.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Flashcards
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                {category?.name ?? "Đang tải..."}
              </h1>
              <p className="text-sm text-slate-500">
                {category?.description ?? "Luyện tập từ vựng theo chủ đề."}
              </p>
            </div>
            <Link
              href={`/learning/${slug ?? ""}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Trở về
            </Link>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>
                Từ {total ? currentIndex + 1 : 0} / {total}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading && (
          <div className="h-72 animate-pulse rounded-3xl border border-slate-200/70 bg-white/70" />
        )}

        {!loading && !currentItem && !error && (
          <div className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-8 text-center text-sm text-slate-500">
            Chủ đề này chưa có từ vựng.
          </div>
        )}

        {!loading && currentItem && (
          <div className="space-y-4">
            <Flashcard
              word={currentItem.word}
              meaning={currentItem.meaning}
              ipa={currentItem.ipa}
              example={currentItem.example}
              exampleMeaning={currentItem.example_meaning}
              flipped={flipped}
              onToggle={() => setFlipped((prev) => !prev)}
              imageUrl={currentItem.media?.image}
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleAudio}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Nghe phát âm
              </button>
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                Trước
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex >= total - 1}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                Tiếp theo
              </button>
              {total > 0 && currentIndex === total - 1 && (
                <button
                  type="button"
                  onClick={handleCompleteVocab}
                  disabled={saving}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Đang lưu..." : "Hoàn thành từ vựng"}
                </button>
              )}
            </div>
          </div>
        )}

        <audio ref={audioRef} src={currentItem?.media?.audio} preload="auto" />

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
    </main>
  );
}
