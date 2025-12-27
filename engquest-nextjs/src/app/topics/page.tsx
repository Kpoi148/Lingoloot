"use client";

import Link from "next/link";
import {
  BookOpen,
  Brain,
  Globe2,
  Headphones,
  PenTool,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  order: number;
  count?: number;
  progress?: number;
};

const iconMap: Record<string, LucideIcon> = {
  "giao-thong": Globe2,
  "cong-so": PenTool,
  "am-thuc": Sparkles,
  "hoc-thuat": BookOpen,
  "ngu-phap": Brain,
  "luyen-nghe": Headphones,
};

const skeletonCards = Array.from({ length: 6 });

export default function TopicsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const response = await fetch("/api/categories", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load categories.");
        }
        const data = (await response.json()) as { data?: Category[] };
        if (active) {
          setCategories(data.data ?? []);
        }
      } catch (fetchError) {
        if (active) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load categories."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 shadow-sm">
            EngQuest
          </span>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Danh sách chủ đề học tập
            </h1>
            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              Theo dõi tiến độ học tập của bạn và tiếp cận nhanh các chủ đề
              quan trọng. Mỗi chủ đề là một chặng đường nhỏ để giúp bạn tiến
              bộ.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading &&
            skeletonCards.map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-48 animate-pulse rounded-3xl border border-slate-200/70 bg-white/70"
              />
            ))}

          {!loading &&
            categories.map((category) => {
              const Icon = iconMap[category.slug] ?? BookOpen;
              const progress = Math.min(
                100,
                Math.max(0, category.progress ?? 0)
              );

              return (
                <Link
                  key={category._id}
                  href={`/learning/${category.slug}`}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60 backdrop-blur transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl"
                >
                  <div className="absolute right-4 top-4 h-14 w-14 rounded-2xl bg-amber-100/70 blur-2xl transition group-hover:scale-110" />
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md shadow-slate-900/20 transition group-hover:scale-105">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                      {category.count ?? 0} từ vựng
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {category.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {category.description ?? "Chưa có mô tả cho chủ đề này."}
                  </p>
                  <div className="mt-5">
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Hoàn thành {progress}%.
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>

        {!loading && categories.length === 0 && !error && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white/80 px-6 py-8 text-center text-sm text-slate-500">
            Chưa có chủ đề nào. Hãy thêm dữ liệu vào collection categories.
          </div>
        )}
      </div>
    </main>
  );
}
