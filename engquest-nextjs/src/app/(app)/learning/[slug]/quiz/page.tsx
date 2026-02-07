"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type QuizQuestion = {
  question_text: string;
  options: string[];
  correct_answer: string;
};

type QuizListItem = {
  _id: string;
  title: string;
  level?: string;
  questionCount: number;
  createdAt?: string;
};

type QuizDetailResponse = {
  data?: {
    _id?: string;
    title?: string;
    category?: string;
    level?: string;
    timeLimit?: number;
    questions?: QuizQuestion[];
  };
  message?: string;
};

const DEFAULT_TIME_LIMIT = 120;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN");
};

const getLevelLabel = (level?: string) => {
  if (level === "Cơ bản") return "Dễ";
  if (level === "Khó") return "Khó";
  return "Trung bình";
};

const getLevelBadgeStyle = (level?: string) => {
  if (level === "Cơ bản") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (level === "Khó") {
    return "border-red-200 bg-red-50 text-red-700";
  }
  return "border-amber-200 bg-amber-50 text-amber-700";
};

export default function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedQuizId = searchParams.get("quizId");
  const hasSelection = Boolean(selectedQuizId);
  const [quizItems, setQuizItems] = useState<QuizListItem[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizLevel, setQuizLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLimit, setTimeLimit] = useState(DEFAULT_TIME_LIMIT);
  const [remaining, setRemaining] = useState(DEFAULT_TIME_LIMIT);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [wrongIndexes, setWrongIndexes] = useState<number[]>([]);
  const progressSavedRef = useRef(false);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);

  const total = questions.length;
  const finished = total > 0 && (answeredCount >= total || remaining <= 0);

  useEffect(() => {
    let active = true;
    const resolveParams = async () => {
      const { slug: resolvedSlug } = await params;
      if (active) {
        setSlug(resolvedSlug);
      }
    };
    resolveParams();
    return () => {
      active = false;
    };
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    let active = true;

    const loadQuizList = async () => {
      setListLoading(true);
      setListError(null);
      try {
        const response = await fetch(
          `/api/quizzes?slug=${slug}&list=1`,
          { cache: "no-store" }
        );
        const payload = (await response.json()) as {
          data?: QuizListItem[];
          message?: string;
        };

        if (!response.ok) {
          throw new Error(payload.message ?? "Không thể tải danh sách quiz.");
        }

        if (active) {
          setQuizItems(payload.data ?? []);
        }
      } catch (fetchError) {
        if (active) {
          setListError(
            fetchError instanceof Error
              ? fetchError.message
              : "Không thể tải danh sách quiz."
          );
          setQuizItems([]);
        }
      } finally {
        if (active) {
          setListLoading(false);
        }
      }
    };

    loadQuizList();

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    let active = true;

    if (!selectedQuizId) {
      setQuestions([]);
      setQuizTitle("");
      setQuizLevel("");
      setTimeLimit(DEFAULT_TIME_LIMIT);
      setRemaining(DEFAULT_TIME_LIMIT);
      setError(null);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    const loadQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams({
          slug,
          quizId: selectedQuizId,
        });
        const response = await fetch(`/api/quizzes?${query.toString()}`, {
          cache: "no-store",
        });
        const payload = (await response.json()) as QuizDetailResponse;

        if (!response.ok) {
          throw new Error(payload.message ?? "Không thể tải quiz.");
        }

        if (active) {
          setQuizTitle(payload.data?.title ?? "");
          setQuizLevel(payload.data?.level ?? "");
          setTimeLimit(payload.data?.timeLimit ?? DEFAULT_TIME_LIMIT);
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
          setQuizLevel("");
          setTimeLimit(DEFAULT_TIME_LIMIT);
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
  }, [slug, selectedQuizId]);

  useEffect(() => {
    setCurrentIndex(0);
    setSelected(null);
    setIsCorrect(null);
    setAnsweredCount(0);
    setScore(0);
    setRemaining(timeLimit);
    setWrongIndexes([]);
    progressSavedRef.current = false;
    setProgressMessage(null);
  }, [questions, timeLimit]);

  useEffect(() => {
    if (!hasSelection || finished) return;
    const timer = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [finished, hasSelection]);

  useEffect(() => {
    if (!finished || !slug || progressSavedRef.current) return;
    progressSavedRef.current = true;
    setProgressMessage("Đang cập nhật tiến độ...");

    const saveProgress = async () => {
      try {
        const response = await fetch("/api/progress/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category_slug: slug }),
        });
        const payload = (await response.json()) as {
          data?: { progress?: number };
          message?: string;
        };

        if (!response.ok) {
          throw new Error(payload.message ?? "Không thể cập nhật tiến độ.");
        }

        setProgressMessage(
          `Đã cập nhật tiến độ: ${payload.data?.progress ?? 0}%.`
        );
      } catch (saveError) {
        setProgressMessage(
          saveError instanceof Error
            ? saveError.message
            : "Không thể cập nhật tiến độ."
        );
      }
    };

    void saveProgress();
  }, [finished, slug]);

  const progressPercent = useMemo(() => {
    if (!total) return 0;
    return Math.round((answeredCount / total) * 100);
  }, [answeredCount, total]);

  const playFeedbackSound = (correct: boolean) => {
    if (typeof window === "undefined") return;
    try {
      const AudioContextCtor =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;
      const ctx = audioCtxRef.current ?? new AudioContextCtor();
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

  const handleStartQuiz = (quizId: string) => {
    if (!slug) return;
    router.push(`/learning/${slug}/quiz?quizId=${quizId}`);
  };

  const handleBackToList = () => {
    if (!slug) return;
    router.push(`/learning/${slug}/quiz`);
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
    setRemaining(timeLimit);
    setWrongIndexes([]);
    setQuestions(wrongQuestions);
  };

  const currentQuestion = questions[currentIndex];
  const incorrectCount = Math.max(0, answeredCount - score);
  const displayTitle =
    quizTitle || (slug ? `Luyện tập chủ đề: ${slug.replace(/-/g, " ")}` : "");

  return (
    <main className="min-h-screen bg-surface-page px-4 py-12 text-content">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="rounded-3xl border border-edge bg-surface-card-alpha p-6 shadow-lg shadow-shadow-theme">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-content-muted">
                Quiz
              </p>
              <h1 className="text-2xl font-semibold text-content">
                {hasSelection ? displayTitle : "Danh sách bộ quiz"}
              </h1>
              {hasSelection ? (
                quizLevel && (
                  <p className="mt-2 text-sm text-content-secondary">
                    Mức độ: {quizLevel}
                  </p>
                )
              ) : (
                <p className="mt-2 text-sm text-content-secondary">
                  Chọn một bộ quiz để bắt đầu luyện tập.
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {hasSelection && (
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="rounded-full border border-edge bg-surface-card px-4 py-2 text-sm font-medium text-content-secondary shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  Danh sách quiz
                </button>
              )}
              <Link
                href={`/learning/${slug ?? ""}`}
                className="rounded-full border border-edge bg-surface-card px-4 py-2 text-sm font-medium text-content-secondary shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Trở về
              </Link>
            </div>
          </div>

          {hasSelection && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-content-muted">
                <span>
                  Đã làm {answeredCount} / {total}
                </span>
                <span>{formatTime(remaining)}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-progress-track">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {!hasSelection && (
          <>
            {listLoading && (
              <div className="h-48 animate-pulse rounded-3xl border border-edge bg-surface-card-alpha" />
            )}

            {listError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800/50 dark:bg-red-950/50 dark:text-red-400">
                {listError}
              </div>
            )}

            {!listLoading && !listError && quizItems.length === 0 && (
              <div className="rounded-2xl border border-edge bg-surface-card-alpha px-6 py-8 text-center text-sm text-content-muted">
                Chủ đề này chưa có bộ quiz nào.
              </div>
            )}

            {!listLoading && !listError && quizItems.length > 0 && (
              <div className="grid gap-4">
                {quizItems.map((item) => {
                  const createdAt = formatDate(item.createdAt);
                  const levelLabel = getLevelLabel(item.level);
                  const levelStyle = getLevelBadgeStyle(item.level);
                  return (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => handleStartQuiz(item._id)}
                      className="group relative flex w-full flex-col items-start justify-between rounded-3xl border border-edge-muted bg-surface-card-alpha p-6 text-left shadow-lg shadow-shadow-theme transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <span
                        className={`absolute right-4 top-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${levelStyle}`}
                      >
                        {levelLabel}
                      </span>
                      <div className="flex w-full items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-content-muted">
                            Bộ quiz
                          </p>
                          <h3 className="mt-3 text-lg font-semibold text-content">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm text-content-secondary">
                            Độ khó: {levelLabel}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-content-muted">
                        <span>{item.questionCount} câu hỏi</span>
                        {createdAt && <span>{createdAt}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {hasSelection && loading && (
          <div className="h-64 animate-pulse rounded-3xl border border-edge bg-surface-card-alpha" />
        )}

        {hasSelection && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800/50 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}

        {hasSelection && !loading && !error && total === 0 && (
          <div className="rounded-2xl border border-edge bg-surface-card-alpha px-6 py-8 text-center text-sm text-content-muted">
            Bộ quiz này chưa có câu hỏi.
          </div>
        )}

        {hasSelection && finished && (
          <div className="rounded-3xl border border-edge bg-surface-card-alpha p-6 text-center shadow-lg shadow-shadow-theme">
            <h2 className="text-2xl font-semibold text-content">
              Hoàn thành bài quiz!
            </h2>
            <p className="mt-2 text-sm text-content-secondary">
              Bạn trả lời đúng {score}/{total} câu hỏi.
            </p>
            <p className="mt-2 text-sm text-content-secondary">
              Đúng: {score} · Sai: {incorrectCount}
            </p>
            <p className="mt-2 text-sm font-semibold text-content">
              Điểm đạt được: {score * 10}
            </p>
            {progressMessage && (
              <p className="mt-2 text-sm text-content-secondary">{progressMessage}</p>
            )}
            <Link
              href={`/learning/${slug ?? ""}`}
              className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white dark:text-slate-900"
            >
              Quay lại chủ đề
            </Link>
            {wrongIndexes.length > 0 && (
              <button
                type="button"
                onClick={handleRetryWrong}
                className="ml-3 mt-4 inline-flex rounded-full border border-edge bg-surface-card px-5 py-2 text-sm font-semibold text-content-secondary shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Học lại những từ đã sai
              </button>
            )}
          </div>
        )}

        {hasSelection && !loading && !error && !finished && currentQuestion && (
          <div className="rounded-3xl border border-edge bg-surface-card-alpha p-8 shadow-xl shadow-shadow-theme">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-content-muted">
              Câu {currentIndex + 1}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-content">
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
                    className={`rounded-2xl border px-5 py-4 text-left text-sm font-semibold shadow-sm transition duration-200 ${showCorrect
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                        : showWrong
                          ? "border-red-300 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-950/50 dark:text-red-400"
                          : "border-edge bg-surface-card text-content-secondary hover:-translate-y-0.5 hover:shadow-md"
                      }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selected && (
              <p className="mt-4 text-sm font-semibold text-content-secondary">
                {isCorrect ? "Đúng rồi!" : "Chưa đúng, thử lại ở câu sau nhé."}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                onClick={handleNext}
                disabled={!selected}
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900"
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
