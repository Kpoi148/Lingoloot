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
        level: quiz.level,
        timeLimit: quiz.timeLimit,
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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const rawTimeLimit =
      typeof body?.timeLimit === "number"
        ? body.timeLimit
        : typeof body?.timeLimit === "string"
        ? Number.parseFloat(body.timeLimit)
        : null;
    const timeLimit =
      rawTimeLimit && Number.isFinite(rawTimeLimit)
        ? Math.round(rawTimeLimit)
        : null;

    if (!title && !timeLimit) {
      return NextResponse.json(
        { message: "Vui lòng nhập dữ liệu cập nhật." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const updatePayload: { title?: string; timeLimit?: number } = {};
    if (title) {
      updatePayload.title = title;
    }
    if (timeLimit !== null) {
      if (timeLimit < 30 || timeLimit > 3600) {
        return NextResponse.json(
          { message: "Thời gian phải từ 30 đến 3600 giây." },
          { status: 400 }
        );
      }
      updatePayload.timeLimit = timeLimit;
    }

    const updated = await Quiz.findByIdAndUpdate(params.id, updatePayload, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ message: "Quiz not found." }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        _id: updated._id.toString(),
        title: updated.title,
        timeLimit: updated.timeLimit,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể cập nhật quiz.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
