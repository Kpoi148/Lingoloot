import Link from "next/link";
import { notFound } from "next/navigation";
import Quiz from "@/models/Quiz";
import { connectToDatabase } from "@/lib/db/mongodb";

type QuizDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;
  await connectToDatabase();

  const quiz = await Quiz.findById(id).lean();

  if (!quiz) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Quiz
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">{quiz.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              ⏱ {quiz.timeLimit ?? 120}s
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              📚 {quiz.category}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              📊 {quiz.level ?? "Trung bình"}
            </span>
          </div>
        </div>
        <Link
          href="/admin/quiz-management"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Quay lại danh sách
        </Link>
      </div>

      <div className="space-y-4">
        {quiz.questions?.map((question, index) => (
          <div
            key={`${quiz._id}-${index}`}
            className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Câu {index + 1}
            </p>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">
              {question.question_text}
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {question.options?.map((option, optionIndex) => {
                const isCorrect = option === question.correct_answer;
                return (
                  <div
                    key={`${quiz._id}-${index}-${optionIndex}`}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium ${isCorrect
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-600"
                      }`}
                  >
                    {option}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
