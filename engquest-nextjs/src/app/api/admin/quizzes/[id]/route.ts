import { NextResponse } from "next/server";
import Quiz from "../../../../../models/Quiz";
import { connectToDatabase } from "../../../../../lib/mongodb";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const quiz = await Quiz.findById(params.id).lean();

    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found." }, { status: 404 });
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
      error instanceof Error ? error.message : "Không thể tải chi tiết quiz.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const deleted = await Quiz.findByIdAndDelete(params.id).lean();

    if (!deleted) {
      return NextResponse.json({ message: "Quiz not found." }, { status: 404 });
    }

    return NextResponse.json({ data: { _id: params.id } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể xóa quiz.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
