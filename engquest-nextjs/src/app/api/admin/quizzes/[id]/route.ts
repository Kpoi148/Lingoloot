import { NextResponse } from "next/server";
import { createApiErrorResponse } from "@/lib/api-error";
import { requireAdminApiSession } from "@/lib/api-auth";
import Quiz from "../../../../../models/Quiz";
import { connectToDatabase } from "../../../../../lib/mongodb";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApiSession();
    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const { id } = await params;
    await connectToDatabase();
    const quiz = await Quiz.findById(id).lean();

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
    return createApiErrorResponse({
      error,
      scope: "api/admin/quizzes/[id]:GET",
      publicMessage: "Không thể tải chi tiết quiz.",
    });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApiSession();
    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const { id } = await params;
    await connectToDatabase();
    const deleted = await Quiz.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ message: "Quiz not found." }, { status: 404 });
    }

    return NextResponse.json({ data: { _id: id } });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/admin/quizzes/[id]:DELETE",
      publicMessage: "Không thể xóa quiz.",
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApiSession();
    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const { id } = await params;
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

    const updated = await Quiz.findByIdAndUpdate(id, updatePayload, {
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
    return createApiErrorResponse({
      error,
      scope: "api/admin/quizzes/[id]:PATCH",
      publicMessage: "Không thể cập nhật quiz.",
    });
  }
}
