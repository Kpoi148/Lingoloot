// Learner page for browsing available topics before starting a study flow.
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { TopicsPageClient } from "@/components/topics/TopicsPageClient";
import type { TopicRecord } from "@/components/topics/types";
import {
  getCachedCategories,
  getCachedTopicProgress,
  getCachedVocabCounts,
} from "@/lib/db/cached-queries";

export const dynamic = "force-dynamic";

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
    const parsedUpdatedAt = category.lastContentUpdatedAt
      ? new Date(category.lastContentUpdatedAt)
      : null;

    return {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      order: category.order,
      count: typeof liveCount === "number" ? liveCount : category.count ?? 0,
      progress: progressValue,
      lastContentUpdatedAt:
        parsedUpdatedAt && !Number.isNaN(parsedUpdatedAt.getTime())
          ? parsedUpdatedAt.toISOString()
          : null,
    } satisfies TopicRecord;
  });
};

export default async function TopicsPage() {
  let topics: TopicRecord[] = [];
  let error: string | null = null;

  try {
    topics = await loadCategories();
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Unable to load categories.";
  }

  return <TopicsPageClient topics={topics} error={error} />;
}
