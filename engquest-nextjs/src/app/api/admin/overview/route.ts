import { NextResponse } from "next/server";
import Category from "../../../../models/Category";
import Quiz from "../../../../models/Quiz";
import User from "../../../../models/User";
import Vocabulary from "../../../../models/Vocabulary";
import { connectToDatabase } from "../../../../lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();

    const [vocabularyCount, categoryCount, quizCount, userCount] =
      await Promise.all([
        Vocabulary.countDocuments(),
        Category.countDocuments(),
        Quiz.countDocuments(),
        User.countDocuments(),
      ]);

    return NextResponse.json({
      data: {
        vocabularyCount,
        categoryCount,
        quizCount,
        userCount,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load overview data.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
