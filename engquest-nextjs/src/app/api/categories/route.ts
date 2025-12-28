import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth-options";
import Category from "../../../models/Category";
import Vocabulary from "../../../models/Vocabulary";
import TopicProgress from "../../../models/TopicProgress";
import { connectToDatabase } from "../../../lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    const categories = await Category.find()
      .sort({ order: 1 })
      .select("name slug description image_url order count")
      .lean();

    const vocabCounts = await Vocabulary.aggregate([
      { $group: { _id: "$category_id", count: { $sum: 1 } } },
    ]);

    const countMap = new Map<string, number>(
      vocabCounts.map((item) => [String(item._id), item.count])
    );

    const progressMap = new Map<string, { vocab_completed?: boolean; quiz_completed?: boolean }>();

    if (session?.user?.id) {
      const progressDocs = await TopicProgress.find({
        user_id: session.user.id,
      })
        .select("category_id vocab_completed quiz_completed")
        .lean();

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
    const message =
      error instanceof Error ? error.message : "Unable to fetch categories.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
