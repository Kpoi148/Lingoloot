// Cached query helpers used by admin dashboards and repeated reads.
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";
import Category from "@/models/Category";
import Quiz from "@/models/Quiz";
import TopicProgress from "@/models/TopicProgress";
import User from "@/models/User";
import Vocabulary from "@/models/Vocabulary";
import { connectToDatabase } from "@/lib/db/mongodb";

type DashboardMonthBucket = {
  date: Date;
  label: string;
  monthKey: string;
};

type MonthlyCountAggregation = {
  _id: {
    year: number;
    month: number;
  };
  count: number;
};

type CategorySummary = {
  _id: mongoose.Types.ObjectId;
  name: string;
  order: number;
};

type VocabularyCountByCategory = {
  _id: mongoose.Types.ObjectId | string;
  count: number;
};

type ProgressAggregation = {
  trackedTopics: number;
  vocabCompleted: number;
  quizCompleted: number;
  fullyCompleted: number;
};

const DASHBOARD_TREND_MONTHS = 6;

function createDashboardMonthBuckets(
  size = DASHBOARD_TREND_MONTHS
): DashboardMonthBucket[] {
  const currentMonth = new Date();
  currentMonth.setUTCDate(1);
  currentMonth.setUTCHours(0, 0, 0, 0);

  return Array.from({ length: size }, (_, index) => {
    const offset = size - index - 1;
    const date = new Date(
      Date.UTC(
        currentMonth.getUTCFullYear(),
        currentMonth.getUTCMonth() - offset,
        1
      )
    );

    return {
      date,
      label: date
        .toLocaleString("vi-VN", { month: "short", timeZone: "UTC" })
        .replace(".", ""),
      monthKey: `${date.getUTCFullYear()}-${String(
        date.getUTCMonth() + 1
      ).padStart(2, "0")}`,
    };
  });
}

function createMonthlyCountMap(rows: MonthlyCountAggregation[]) {
  return new Map(
    rows.map((row) => [
      `${row._id.year}-${String(row._id.month).padStart(2, "0")}`,
      row.count,
    ])
  );
}

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

export const getCachedDashboardAnalytics = unstable_cache(
  async () => {
    await connectToDatabase();

    const monthBuckets = createDashboardMonthBuckets();
    const trendStartDate = monthBuckets[0]?.date ?? new Date();
    const activeLearnerWindowStart = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    );

    const [
      vocabularyTrendRows,
      quizTrendRows,
      userTrendRows,
      categoryDocs,
      vocabularyCountRows,
      progressRows,
      activeLearnerCount,
      learnerCount,
    ] = await Promise.all([
      Vocabulary.aggregate<MonthlyCountAggregation>([
        { $match: { created_at: { $gte: trendStartDate } } },
        {
          $group: {
            _id: {
              year: { $year: "$created_at" },
              month: { $month: "$created_at" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Quiz.aggregate<MonthlyCountAggregation>([
        { $match: { createdAt: { $gte: trendStartDate } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      User.aggregate<MonthlyCountAggregation>([
        { $match: { createdAt: { $gte: trendStartDate }, role: "user" } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Category.find().sort({ order: 1 }).select("name order").lean<CategorySummary[]>(),
      Vocabulary.aggregate<VocabularyCountByCategory>([
        { $group: { _id: "$category_id", count: { $sum: 1 } } },
      ]),
      TopicProgress.aggregate<ProgressAggregation>([
        {
          $group: {
            _id: null,
            trackedTopics: { $sum: 1 },
            vocabCompleted: {
              $sum: { $cond: [{ $eq: ["$vocab_completed", true] }, 1, 0] },
            },
            quizCompleted: {
              $sum: { $cond: [{ $eq: ["$quiz_completed", true] }, 1, 0] },
            },
            fullyCompleted: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$vocab_completed", true] },
                      { $eq: ["$quiz_completed", true] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),
      User.countDocuments({
        role: "user",
        isBanned: { $ne: true },
        lastLoginAt: { $gte: activeLearnerWindowStart },
      }),
      User.countDocuments({ role: "user", isBanned: { $ne: true } }),
    ]);

    const vocabularyTrendMap = createMonthlyCountMap(vocabularyTrendRows);
    const quizTrendMap = createMonthlyCountMap(quizTrendRows);
    const userTrendMap = createMonthlyCountMap(userTrendRows);

    const trends = monthBuckets.map((bucket) => ({
      label: bucket.label,
      monthKey: bucket.monthKey,
      vocabularyCount: vocabularyTrendMap.get(bucket.monthKey) ?? 0,
      quizCount: quizTrendMap.get(bucket.monthKey) ?? 0,
      userCount: userTrendMap.get(bucket.monthKey) ?? 0,
    }));

    const vocabularyCountMap = new Map(
      vocabularyCountRows.map((item) => [String(item._id), item.count])
    );
    const totalVocabulary = Array.from(vocabularyCountMap.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    const categoryDistribution = categoryDocs
      .map((category) => {
        const vocabularyCount = vocabularyCountMap.get(String(category._id)) ?? 0;

        return {
          id: String(category._id),
          name: category.name,
          order: category.order,
          vocabularyCount,
          share:
            totalVocabulary > 0 ? vocabularyCount / totalVocabulary : 0,
        };
      })
      .sort(
        (left, right) =>
          right.vocabularyCount - left.vocabularyCount ||
          left.order - right.order
      )
      .slice(0, 6)
      .map((category) => ({
        id: category.id,
        name: category.name,
        vocabularyCount: category.vocabularyCount,
        share: category.share,
      }));

    const progressSnapshot = progressRows[0] ?? {
      trackedTopics: 0,
      vocabCompleted: 0,
      quizCompleted: 0,
      fullyCompleted: 0,
    };

    return {
      trends,
      categoryDistribution,
      progress: {
        ...progressSnapshot,
        activeLearnerCount,
        learnerCount,
      },
    };
  },
  ["admin:dashboard-analytics"],
  { revalidate: 60 }
);
