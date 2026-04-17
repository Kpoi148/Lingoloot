// Cached query helpers used by admin dashboards and repeated reads.
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";
import Category from "@/models/Category";
import Quiz from "@/models/Quiz";
import TopicProgress from "@/models/TopicProgress";
import User from "@/models/User";
import Vocabulary from "@/models/Vocabulary";
import { connectToDatabase } from "@/lib/db/mongodb";

type DashboardDayBucket = {
  date: Date;
  dateKey: string;
};

type DailyCountAggregation = {
  _id: string;
  count: number;
};

type ProgressAggregation = {
  trackedTopics: number;
  vocabCompleted: number;
  quizCompleted: number;
  fullyCompleted: number;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DASHBOARD_TREND_LOOKBACK_DAYS = 760;

function toUtcDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function createDashboardDayBuckets(
  size = DASHBOARD_TREND_LOOKBACK_DAYS
): DashboardDayBucket[] {
  const currentDay = new Date();
  currentDay.setUTCHours(0, 0, 0, 0);

  return Array.from({ length: size }, (_, index) => {
    const offset = size - index - 1;
    const date = new Date(currentDay.getTime() - offset * DAY_IN_MS);

    return {
      date,
      dateKey: toUtcDateKey(date),
    };
  });
}

function createDailyCountMap(rows: DailyCountAggregation[]) {
  return new Map(rows.map((row) => [row._id, row.count]));
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

    const dayBuckets = createDashboardDayBuckets();
    const trendStartDate = dayBuckets[0]?.date ?? new Date();
    const activeLearnerWindowStart = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    );

    const [
      vocabularyTrendRows,
      quizTrendRows,
      userTrendRows,
      progressRows,
      activeLearnerCount,
      learnerCount,
    ] = await Promise.all([
      Vocabulary.aggregate<DailyCountAggregation>([
        { $match: { created_at: { $gte: trendStartDate } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$created_at",
                timezone: "UTC",
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Quiz.aggregate<DailyCountAggregation>([
        { $match: { createdAt: { $gte: trendStartDate } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "UTC",
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      User.aggregate<DailyCountAggregation>([
        { $match: { createdAt: { $gte: trendStartDate }, role: "user" } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "UTC",
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
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

    const vocabularyTrendMap = createDailyCountMap(vocabularyTrendRows);
    const quizTrendMap = createDailyCountMap(quizTrendRows);
    const userTrendMap = createDailyCountMap(userTrendRows);

    const timeline = dayBuckets.map((bucket) => ({
      dateKey: bucket.dateKey,
      vocabularyCount: vocabularyTrendMap.get(bucket.dateKey) ?? 0,
      quizCount: quizTrendMap.get(bucket.dateKey) ?? 0,
      userCount: userTrendMap.get(bucket.dateKey) ?? 0,
    }));

    const progressSnapshot = progressRows[0] ?? {
      trackedTopics: 0,
      vocabCompleted: 0,
      quizCompleted: 0,
      fullyCompleted: 0,
    };

    return {
      timeline,
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
