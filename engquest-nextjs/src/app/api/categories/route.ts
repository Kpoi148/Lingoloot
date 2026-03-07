// Public API for listing learning categories and topics.
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { createApiErrorResponse } from "@/lib/security/api-error";
import { authOptions } from "@/lib/auth/auth-options";
import {
  getCachedCategorySummaries,
  getCachedTopicProgress,
  getCachedVocabCounts,
} from "@/lib/db/cached-queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const [categories, vocabCounts] = await Promise.all([
      getCachedCategorySummaries(),
      getCachedVocabCounts(),
    ]);

    const countMap = new Map<string, number>(
      vocabCounts.map((item) => [String(item._id), item.count])
    );

    const progressMap = new Map<string, { vocab_completed?: boolean; quiz_completed?: boolean }>();

    if (session?.user?.id) {
      const progressDocs = await getCachedTopicProgress(session.user.id);
      progressDocs.forEach((doc) => {
        progressMap.set(String(doc.category_id), {
          vocab_completed: doc.vocab_completed,
          quiz_completed: doc.quiz_completed,
        });
      });
    }

    const data = categories.map((category) => {
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
    });

    return NextResponse.json({ data });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/categories",
      publicMessage: "Unable to fetch categories.",
    });
  }
}
