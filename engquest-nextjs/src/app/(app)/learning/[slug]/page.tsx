import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCachedCategoryBySlug,
  getCachedVocabCountByCategory,
} from "@/lib/cached-queries";

export const dynamic = "force-dynamic";

type LearningPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LearningPage({ params }: LearningPageProps) {
  const { slug } = await params;

  const category = await getCachedCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const vocabCount = await getCachedVocabCountByCategory(
    String(category._id)
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 shadow-sm">
              EngQuest
            </span>
            <Link
              href="/topics"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Trở về
            </Link>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {category.name}
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
            {category.description ?? "Chưa có mô tả cho chủ đề này."}
          </p>
          <p className="text-sm font-medium text-slate-500">
            {vocabCount} từ vựng trong chủ đề này.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href={`/learning/${category.slug}/flashcards`}
            className="group flex flex-col items-start justify-between rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30 transition group-hover:scale-105">
              F
            </div>
            <div className="mt-4 space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Bắt đầu học (Flashcards)
              </h2>
              <p className="text-sm text-slate-500">
                Ôn từ vựng nhanh với thẻ ghi nhớ, tập trung vào từ khó.
              </p>
            </div>
          </Link>

          <Link
            href={`/learning/${category.slug}/quiz`}
            className="group flex flex-col items-start justify-between rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md shadow-slate-900/30 transition group-hover:scale-105">
              Q
            </div>
            <div className="mt-4 space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Luyện tập (Quiz)
              </h2>
              <p className="text-sm text-slate-500">
                Kiểm tra nhanh và theo dõi tiến độ của bạn.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
