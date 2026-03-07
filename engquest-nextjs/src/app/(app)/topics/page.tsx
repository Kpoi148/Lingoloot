// Learner page for browsing available topics before starting a study flow.
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
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import {
  getCachedCategories,
  getCachedTopicProgress,
  getCachedVocabCounts,
} from "@/lib/db/cached-queries";
import { isRecent } from "@/lib/shared/utils";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  order: number;
  count?: number;
  progress?: number;
  lastContentUpdatedAt?: Date;
};

export const dynamic = "force-dynamic";

const iconMap: Record<string, LucideIcon> = {
  "giao-thong": Globe2,
  "cong-so": PenTool,
  "am-thuc": Sparkles,
  "hoc-thuat": BookOpen,
  "ngu-phap": Brain,
  "luyen-nghe": Headphones,
};

const loadCategories = async () => {
  const session = await getServerSession(authOptions);

  const [categories, vocabCounts] = await Promise.all([
    getCachedCategories(),
    getCachedVocabCounts(),
  ]);

  const countMap = new Map<string, number>(
    vocabCounts.map((item) => [String(item._id), item.count])
  );

  const progressMap = new Map<
    string,
    { vocab_completed?: boolean; quiz_completed?: boolean }
  >();

  if (session?.user?.id) {
    const progressDocs = await getCachedTopicProgress(session.user.id);
    progressDocs.forEach((doc) => {
      progressMap.set(String(doc.category_id), {
        vocab_completed: doc.vocab_completed,
        quiz_completed: doc.quiz_completed,
      });
    });
  }

  return categories.map((category) => {
    const liveCount = countMap.get(String(category._id));
    const progress = progressMap.get(String(category._id));
    const progressValue =
      (progress?.vocab_completed ? 50 : 0) +
      (progress?.quiz_completed ? 50 : 0);
    return {
      ...category,
      _id: category._id.toString(),
      count: typeof liveCount === "number" ? liveCount : category.count ?? 0,
      progress: progressValue,
    };
  }) as Category[];
};

export default async function TopicsPage() {
  let categories: Category[] = [];
  let error: string | null = null;

  try {
    categories = await loadCategories();
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Unable to load categories.";
  }

  return (
    <main className="min-h-screen bg-surface-page px-4 py-12 text-content">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-edge bg-surface-card px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-content-muted shadow-sm">
            LingoLoot
          </span>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Danh sách chủ đề học tập
            </h1>
            <p className="max-w-2xl text-sm text-content-secondary sm:text-base">
              Theo dõi tiến độ học tập của bạn và tiếp cận nhanh các chủ đề
              quan trọng. Mỗi chủ đề là một chặng đường nhỏ để giúp bạn tiến
              bộ.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800/50 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const Icon = iconMap[category.slug] ?? BookOpen;
            const progress = Math.min(
              100,
              Math.max(0, category.progress ?? 0)
            );
            const isNew = category.lastContentUpdatedAt
              ? isRecent(category.lastContentUpdatedAt)
              : false;

            return (
              <Link
                key={category._id}
                href={`/learning/${category.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-edge-muted bg-surface-card-alpha p-6 shadow-lg shadow-shadow-theme backdrop-blur transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl"
              >
                {isNew && (
                  <span className="absolute right-2 top-2 z-10 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white animate-pulse">
                    NEW
                  </span>
                )}
                <div className="absolute right-4 top-4 z-0 h-14 w-14 rounded-2xl bg-amber-100/70 blur-2xl transition group-hover:scale-110 dark:bg-amber-500/20" />
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md shadow-slate-900/20 transition group-hover:scale-105 dark:bg-white dark:text-slate-900">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="rounded-full border border-edge bg-surface-card px-3 py-1 text-xs font-semibold text-content-muted">
                    {category.count ?? 0} từ vựng
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-content">
                  {category.name}
                </h2>
                <p className="mt-2 text-sm text-content-muted">
                  {category.description ?? "Chưa có mô tả cho chủ đề này."}
                </p>
                <div className="mt-5">
                  <div className="h-2 w-full rounded-full bg-progress-track">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-content-muted">
                    Hoàn thành {progress}%.
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {categories.length === 0 && !error && (
          <div className="mt-10 rounded-2xl border border-edge bg-surface-card-alpha px-6 py-8 text-center text-sm text-content-muted">
            Chưa có chủ đề nào. Hãy thêm dữ liệu vào collection categories.
          </div>
        )}
      </div>
    </main>
  );
}
