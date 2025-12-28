import { NextResponse } from "next/server";
import Quiz from "../../../models/Quiz";
import { connectToDatabase } from "../../../lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug")?.trim();

    if (!slug) {
      return NextResponse.json(
        { message: "Missing category slug." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const quiz = await Quiz.findOne({ category: slug })
      .sort({ createdAt: -1 })
      .select("title category questions")
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
        questions: quiz.questions ?? [],
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load quiz.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
