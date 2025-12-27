import { NextResponse } from "next/server";
import Quiz from "../../../../models/Quiz";
import { connectToDatabase } from "../../../../lib/mongodb";

export async function GET(req: Request) {
  try {
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
      .select("title category questions createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const data = quizzes.map((quiz) => ({
      _id: quiz._id.toString(),
      title: quiz.title,
      category: quiz.category,
      questionCount: quiz.questions?.length ?? 0,
      createdAt: quiz.createdAt,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể tải danh sách quiz.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const category =
      typeof body?.category === "string" ? body.category.trim() : "";
    const questions = Array.isArray(body?.questions) ? body.questions : [];

    if (!title || !category || questions.length === 0) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin." },
        { status: 400 }
      );
    }

    const normalizedQuestions = questions.map((item: any) => {
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
    });

    const isValid = normalizedQuestions.every((item) => {
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
      questions: normalizedQuestions,
    });

    return NextResponse.json({ data: { _id: created._id.toString() } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể tạo bài quiz.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
