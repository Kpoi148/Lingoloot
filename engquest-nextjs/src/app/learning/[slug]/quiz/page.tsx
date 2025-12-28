"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type QuizQuestion = {
  question_text: string;
  options: string[];
  correct_answer: string;
};

type QuizApiResponse = {
  data?: {
    title?: string;
    category?: string;
    questions?: QuizQuestion[];
  };
  message?: string;
};

const TOTAL_TIME = 120;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export default function QuizPage({ params }: { params: { slug: string } }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [score, setScore] = useState(0);
  const [remaining, setRemaining] = useState(TOTAL_TIME);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [wrongIndexes, setWrongIndexes] = useState<number[]>([]);

  const total = questions.length;
  const finished = total > 0 && (answeredCount >= total || remaining <= 0);

  useEffect(() => {
    let active = true;

    const loadQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/quizzes?slug=${params.slug}`, {
          cache: "no-store",
        });
        const payload = (await response.json()) as QuizApiResponse;

        if (!response.ok) {
          throw new Error(payload.message ?? "Không thể tải quiz.");
        }

        if (active) {
          setQuizTitle(payload.data?.title ?? "");
          setQuestions(payload.data?.questions ?? []);
        }
      } catch (fetchError) {
        if (active) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Không thể tải quiz."
          );
          setQuestions([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadQuiz();

    return () => {
      active = false;
    };
  }, [params.slug]);

  useEffect(() => {
    setCurrentIndex(0);
    setSelected(null);
    setIsCorrect(null);
    setAnsweredCount(0);
    setScore(0);
    setRemaining(TOTAL_TIME);
    setWrongIndexes([]);
  }, [questions]);

  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [finished]);

  const progressPercent = useMemo(() => {
    if (!total) return 0;
    return Math.round((answeredCount / total) * 100);
  }, [answeredCount, total]);

  const playFeedbackSound = (correct: boolean) => {
    if (typeof window === "undefined") return;
    try {
      const AudioContext =
        window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current ?? new AudioContext();
      audioCtxRef.current = ctx;

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = correct ? 740 : 220;
      gain.gain.value = 0.08;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.15);
    } catch {
      // Ignore audio errors (autoplay policy, unsupported browser, etc.)
    }
  };

  const handleSelect = (option: string) => {
    if (selected || finished) return;
    const current = questions[currentIndex];
    if (!current) return;
    const correct = option === current.correct_answer;
    setSelected(option);
    setIsCorrect(correct);
    setAnsweredCount((prev) => Math.min(total, prev + 1));
    if (correct) {
      setScore((prev) => prev + 1);
    } else {
      setWrongIndexes((prev) => [...prev, currentIndex]);
    }
    playFeedbackSound(correct);
  };

  const handleNext = () => {
    if (!selected && remaining > 0) return;
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelected(null);
      setIsCorrect(null);
    }
  };

  const handleRetryWrong = () => {
    if (!wrongIndexes.length) return;
    const uniqueWrong = Array.from(new Set(wrongIndexes));
    const wrongQuestions = uniqueWrong
      .map((index) => questions[index])
      .filter(Boolean);

    if (!wrongQuestions.length) return;
    setSelected(null);
    setIsCorrect(null);
    setCurrentIndex(0);
    setAnsweredCount(0);
    setScore(0);
    setRemaining(TOTAL_TIME);
    setWrongIndexes([]);
    setQuestions(wrongQuestions);
  };

  const currentQuestion = questions[currentIndex];
  const incorrectCount = Math.max(0, answeredCount - score);
  const displayTitle =
    quizTitle || `Luyện tập chủ đề: ${params.slug.replace(/-/g, " ")}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Quiz
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                {displayTitle}
              </h1>
            </div>
            <Link
              href={`/learning/${params.slug}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Trở về
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>
                Đã làm {answeredCount} / {total}
              </span>
              <span>{formatTime(remaining)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white/70" />
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && total === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-8 text-center text-sm text-slate-500">
            Chủ đề này chưa có quiz.
          </div>
        )}

        {finished && (
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-center shadow-lg shadow-slate-200/60">
            <h2 className="text-2xl font-semibold text-slate-900">
              Hoàn thành bài quiz!
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Bạn trả lời đúng {score}/{total} câu hỏi.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Đúng: {score} · Sai: {incorrectCount}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Điểm đạt được: {score * 10}
            </p>
            <Link
              href={`/learning/${params.slug}`}
              className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Quay lại chủ đề
            </Link>
            {wrongIndexes.length > 0 && (
              <button
                type="button"
                onClick={handleRetryWrong}
                className="ml-3 mt-4 inline-flex rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Học lại những từ đã sai
              </button>
            )}
          </div>
        )}

        {!loading && !error && !finished && currentQuestion && (
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/60">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Câu {currentIndex + 1}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              {currentQuestion.question_text}
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {currentQuestion.options.map((option) => {
                const isSelected = selected === option;
                const isAnswer = option === currentQuestion.correct_answer;
                const showCorrect = selected && isAnswer;
                const showWrong = selected && isSelected && !isAnswer;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    disabled={!!selected || remaining <= 0}
                    className={`rounded-2xl border px-5 py-4 text-left text-sm font-semibold shadow-sm transition duration-200 ${
                      showCorrect
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : showWrong
                        ? "border-red-300 bg-red-50 text-red-600"
                        : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:shadow-md"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selected && (
              <p className="mt-4 text-sm font-semibold text-slate-600">
                {isCorrect ? "Đúng rồi!" : "Chưa đúng, thử lại ở câu sau nhé."}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                onClick={handleNext}
                disabled={!selected}
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                Tiếp theo
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
