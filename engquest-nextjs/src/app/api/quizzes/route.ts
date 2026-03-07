// Public API for serving quiz content to learner pages.
import { NextResponse } from "next/server";
import { createApiErrorResponse } from "@/lib/security/api-error";
import Quiz from "../../../models/Quiz";
import { connectToDatabase } from "@/lib/db/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug")?.trim();
    const level = searchParams.get("level")?.trim();
    const quizId = searchParams.get("quizId")?.trim();
    const listMode = searchParams.get("list") === "1";

    if (!slug) {
      return NextResponse.json(
        { message: "Missing category slug." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const baseFilter = { category: slug };
    const rawLevels = await Quiz.find(baseFilter).distinct("level");
    const availableLevels = (rawLevels ?? [])
      .filter((item) => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);

    if (listMode) {
      const quizzes = await Quiz.find(baseFilter)
        .sort({ createdAt: -1 })
        .select("title level timeLimit questions createdAt")
        .lean();

      const items = quizzes.map((quiz) => ({
        _id: quiz._id.toString(),
        title: quiz.title,
        level: quiz.level,
        timeLimit: quiz.timeLimit,
        questionCount: quiz.questions?.length ?? 0,
        createdAt: quiz.createdAt,
      }));

      return NextResponse.json({ data: items, availableLevels });
    }

    if (quizId) {
    const quiz = await Quiz.findOne({ _id: quizId, ...baseFilter })
        .select("title category level timeLimit questions")
        .lean();

      if (!quiz) {
        return NextResponse.json(
          { message: "Quiz not found for this topic." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        data: {
          _id: quiz._id.toString(),
          title: quiz.title,
          category: quiz.category,
          level: quiz.level,
          timeLimit: quiz.timeLimit,
          questions: quiz.questions ?? [],
        },
        availableLevels,
      });
    }

    const filter = level ? { ...baseFilter, level } : baseFilter;
    const quiz = await Quiz.findOne(filter)
      .sort({ createdAt: -1 })
      .select("title category level timeLimit questions")
      .lean();

    if (!quiz) {
      return NextResponse.json(
        { message: "Quiz not found for this topic." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        _id: quiz._id.toString(),
        title: quiz.title,
        category: quiz.category,
        level: quiz.level,
        timeLimit: quiz.timeLimit,
        questions: quiz.questions ?? [],
      },
      availableLevels,
    });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/quizzes",
      publicMessage: "Unable to load quiz.",
    });
  }
}
