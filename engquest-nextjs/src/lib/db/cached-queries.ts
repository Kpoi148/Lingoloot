import mongoose from "mongoose";
import { unstable_cache } from "next/cache";
import Category from "@/models/Category";
import Quiz from "@/models/Quiz";
import TopicProgress from "@/models/TopicProgress";
import User from "@/models/User";
import Vocabulary from "@/models/Vocabulary";
import { connectToDatabase } from "@/lib/db/mongodb";

export const getCachedCategories = unstable_cache(
  async () => {
    await connectToDatabase();
    // Cached list avoids re-hydrating full Mongoose documents per request.
    return Category.find()
      .sort({ order: 1 })
      .select(
        "name slug description image_url order count lastContentUpdatedAt"
      )
      .lean();
  },
  ["categories:list"],
  { revalidate: 120 }
);

export const getCachedCategorySummaries = unstable_cache(
  async () => {
    await connectToDatabase();
    return Category.find()
      .sort({ order: 1 })
      .select("name slug description image_url order count")
      .lean();
  },
  ["categories:summary"],
  { revalidate: 120 }
);

export const getCachedVocabCounts = unstable_cache(
  async () => {
    await connectToDatabase();
    // Cached aggregation keeps the $group cost off hot paths.
    return Vocabulary.aggregate([
      { $group: { _id: "$category_id", count: { $sum: 1 } } },
    ]);
  },
  ["vocab:counts"],
  { revalidate: 120 }
);

export const getCachedTopicProgress = (userId: string) =>
  unstable_cache(
    async () => {
      await connectToDatabase();
      return TopicProgress.find({ user_id: userId })
        .select("category_id vocab_completed quiz_completed")
        .lean();
    },
    ["topic-progress", userId],
    { revalidate: 30 }
  )();

export const getCachedCategoryBySlug = unstable_cache(
  async (slug: string) => {
    await connectToDatabase();
    return Category.findOne({ slug })
      .select("_id name description slug")
      .lean();
  },
  ["category:by-slug"],
  { revalidate: 120 }
);

export const getCachedVocabCountByCategory = unstable_cache(
  async (categoryId: string) => {
    await connectToDatabase();
    const objectId = mongoose.Types.ObjectId.isValid(categoryId)
      ? new mongoose.Types.ObjectId(categoryId)
      : null;
    const ids = objectId ? [objectId, categoryId] : [categoryId];
    return Vocabulary.collection.countDocuments({
      category_id: { $in: ids },
    });
  },
  ["vocab:count-by-category"],
  { revalidate: 120 }
);

export const getCachedOverviewCounts = unstable_cache(
  async () => {
    await connectToDatabase();
    const [vocabularyCount, categoryCount, quizCount, userCount] =
      await Promise.all([
        Vocabulary.countDocuments(),
        Category.countDocuments(),
        Quiz.countDocuments(),
        User.countDocuments(),
      ]);

    return {
      vocabularyCount,
      categoryCount,
      quizCount,
      userCount,
    };
  },
  ["admin:overview"],
  { revalidate: 60 }
);
