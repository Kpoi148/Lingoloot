// Admin API for listing and creating quiz content.
import { NextResponse } from "next/server";
import { createApiErrorResponse } from "@/lib/security/api-error";
import { requireAdminApiSession } from "@/lib/auth/api-auth";
import Category from "../../../../models/Category";
import Quiz, { type QuizQuestion } from "../../../../models/Quiz";
import { connectToDatabase } from "@/lib/db/mongodb";

const QUIZ_LEVELS = ["Cơ bản", "Trung bình", "Khó"] as const;

export async function GET(req: Request) {
  try {
    const auth = await requireAdminApiSession();
    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() ?? "";
    const filter = query
      ? {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    await connectToDatabase();

    const quizzes = await Quiz.find(filter)
      .select("title category level timeLimit questions createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const data = quizzes.map((quiz) => ({
      _id: quiz._id.toString(),
      title: quiz.title,
      category: quiz.category,
      level: quiz.level,
      timeLimit: quiz.timeLimit,
      questionCount: quiz.questions?.length ?? 0,
      createdAt: quiz.createdAt,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/admin/quizzes:GET",
      publicMessage: "Không thể tải danh sách quiz.",
    });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdminApiSession();
    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const body = await req.json();
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const category =
      typeof body?.category === "string" ? body.category.trim() : "";
    const rawLevel =
      typeof body?.level === "string" ? body.level.trim() : "";
    const level = QUIZ_LEVELS.includes(rawLevel as (typeof QUIZ_LEVELS)[number])
      ? rawLevel
      : "Trung bình";
    const questions = Array.isArray(body?.questions) ? body.questions : [];

    if (!title || !category || questions.length === 0) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin." },
        { status: 400 }
      );
    }

    const normalizedQuestions: QuizQuestion[] = questions.map(
      (item: { question_text?: unknown; options?: unknown; correct_answer?: unknown }) => {
      const question_text =
        typeof item?.question_text === "string" ? item.question_text.trim() : "";
      const options = Array.isArray(item?.options)
        ? item.options.map((option: string) =>
            typeof option === "string" ? option.trim() : ""
          )
        : [];
      const correct_answer =
        typeof item?.correct_answer === "string"
          ? item.correct_answer.trim()
          : "";

      return { question_text, options, correct_answer };
      }
    );

    const isValid = normalizedQuestions.every((item: QuizQuestion) => {
      if (!item.question_text || item.options.length !== 4) return false;
      if (item.options.some((option) => !option)) return false;
      return item.options.includes(item.correct_answer);
    });

    if (!isValid) {
      return NextResponse.json(
        { message: "Câu hỏi hoặc đáp án chưa hợp lệ." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const created = await Quiz.create({
      title,
      category,
      level,
      questions: normalizedQuestions,
    });

    await Category.findOneAndUpdate(
      { slug: category },
      { $set: { lastContentUpdatedAt: new Date() } }
    );

    return NextResponse.json({ data: { _id: created._id.toString() } });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/admin/quizzes:POST",
      publicMessage: "Không thể tạo bài quiz.",
    });
  }
}
