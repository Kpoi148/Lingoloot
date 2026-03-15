"use client";
// Interactive Story Cloze component that turns saved game data into a playable session.

import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Grip, Puzzle, Sparkles } from "lucide-react";
import CompletionModal from "@/components/game/story-cloze/CompletionModal";
import MeaningPanel from "@/components/game/story-cloze/MeaningPanel";
import ProgressBar from "@/components/game/story-cloze/ProgressBar";
import StoryTextPanel from "@/components/game/story-cloze/StoryTextPanel";
import type { StoryClozeGameData } from "@/components/game/story-cloze/types";
import { useStoryClozeGameController } from "@/components/game/story-cloze/useStoryClozeGameController";
import WordBank from "@/components/game/story-cloze/WordBank";

type StoryClozeGameProps = {
  initialGame: StoryClozeGameData;
  exitHref?: string;
  exitLabel?: string;
};

export default function StoryClozeGame({
  initialGame,
  exitHref = "/learn/practice",
  exitLabel = "Về sảnh game",
}: StoryClozeGameProps) {
  const {
    activeItem,
    answerSet,
    answeredCount,
    availableItems,
    feedback,
    filledItems,
    gaps,
    handleCheck,
    handleClearGap,
    handleDragEnd,
    handleDragStart,
    handleRetryWrong,
    loadMeaning,
    progress,
    resetGame,
    score,
    selectedMeaning,
    sensors,
    setActiveId,
    status,
    userAnswers,
    wrongGaps,
  } = useStoryClozeGameController(initialGame);

  const remainingCount = gaps.length - answeredCount;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-16 pt-8 text-slate-900 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[320px] bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] dark:bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.12),transparent_22%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_26%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.94))]"
      />
      <div
        aria-hidden="true"
        className="absolute left-[-5rem] top-[12rem] -z-10 h-64 w-64 rounded-full bg-amber-300/18 blur-3xl dark:bg-amber-500/8"
      />
      <div
        aria-hidden="true"
        className="absolute right-[-4rem] top-[16rem] -z-10 h-72 w-72 rounded-full bg-sky-300/18 blur-3xl dark:bg-sky-500/10"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-[32px] border border-black/[0.08] bg-white/82 p-5 shadow-[0_36px_100px_-58px_rgba(15,23,42,0.48)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/78 dark:shadow-[0_36px_100px_-58px_rgba(2,6,23,0.92)] sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-[0_20px_44px_-24px_rgba(15,23,42,0.82)] dark:from-slate-200 dark:via-white dark:to-slate-100 dark:text-slate-950">
                <Puzzle className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                    <Grip className="h-3.5 w-3.5" />
                    Drag & Drop
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-500/[0.12] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/[0.18] dark:text-amber-100">
                    <Sparkles className="h-3.5 w-3.5" />
                    Story Cloze
                  </span>
                </div>
                <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                  {initialGame.title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Kéo từng từ vào đúng ô trống trong câu chuyện, kiểm tra nhanh
                  độ chính xác và tận dụng tra nghĩa để đọc hiểu tốt hơn.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-black/[0.08] bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                {answeredCount}/{gaps.length} đã điền
              </div>
              <div className="rounded-full border border-black/[0.08] bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                Còn {remainingCount} ô trống
              </div>
              <Link
                href={exitHref}
                className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100 dark:hover:bg-white/[0.1]"
              >
                <ArrowLeft className="h-4 w-4" />
                {exitLabel}
              </Link>
            </div>
          </div>
        </header>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.86fr)]">
            <section className="rounded-[32px] border border-black/[0.08] bg-white/84 p-6 shadow-[0_36px_100px_-58px_rgba(15,23,42,0.48)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/78 dark:shadow-[0_36px_100px_-58px_rgba(2,6,23,0.92)] sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                    Story board
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Chạm vào từ trong đoạn văn để tra nhanh nghĩa, kéo các chip
                    từ vào đúng blank rồi bấm kiểm tra khi bạn sẵn sàng.
                  </p>
                </div>
                <div className="rounded-full border border-black/[0.08] bg-black/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                  Progress {progress}%
                </div>
              </div>

              <div className="mt-6">
                <StoryTextPanel
                  content={initialGame.content}
                  answerSet={answerSet}
                  userAnswers={userAnswers}
                  filledItems={filledItems}
                  wrongGaps={wrongGaps}
                  onWordClick={(word, isAnswer) => {
                    if (!isAnswer) {
                      void loadMeaning(word);
                    }
                  }}
                  onClearGap={handleClearGap}
                />
              </div>

              <div className="mt-6">
                <WordBank availableItems={availableItems} />
              </div>
            </section>

            <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
              <section className="rounded-[28px] border border-black/[0.08] bg-white/88 p-5 shadow-[0_28px_70px_-48px_rgba(15,23,42,0.48)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/82 dark:shadow-[0_28px_70px_-48px_rgba(2,6,23,0.92)]">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Control panel
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    <span>Độ phủ đáp án</span>
                    <span>{progress}%</span>
                  </div>
                  <ProgressBar progress={progress} />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  <div className="rounded-[22px] border border-black/[0.06] bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                      Điểm hiện tại
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                      {score}/{gaps.length}
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-black/[0.06] bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                      Đã điền
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                      {answeredCount}
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-black/[0.06] bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                      Còn lại
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                      {remainingCount}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={status === "checking" || status === "completed"}
                  className="mt-5 w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950"
                >
                  {status === "completed" ? "Đã hoàn thành" : "Kiểm tra đáp án"}
                </button>

                {feedback === "wrong" ? (
                  <div className="mt-4 rounded-[22px] border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-500/[0.14] dark:text-red-100">
                    <p className="font-semibold">
                      Có {wrongGaps.length} ô sai cần thử lại.
                    </p>
                    <p className="mt-1 text-red-600 dark:text-red-100/80">
                      Các blank sai đã được đánh dấu trực tiếp trên story board.
                    </p>
                    <button
                      type="button"
                      onClick={handleRetryWrong}
                      className="mt-3 rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-red-400/20 dark:bg-slate-950/60 dark:text-red-100"
                    >
                      Thử lại các ô sai
                    </button>
                  </div>
                ) : null}
              </section>

              {selectedMeaning ? (
                <MeaningPanel selection={selectedMeaning} />
              ) : (
                <div className="rounded-[28px] border border-dashed border-black/[0.08] bg-white/76 px-5 py-4 text-sm leading-7 text-slate-500 dark:border-white/10 dark:bg-slate-950/74 dark:text-slate-400">
                  Chạm vào một từ không phải đáp án trong đoạn văn để xem nghĩa
                  nhanh tại đây.
                </div>
              )}
            </aside>
          </div>

          <DragOverlay dropAnimation={null}>
            {activeItem ? (
              <motion.div
                className="cursor-grabbing rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
              >
                {activeItem.word}
              </motion.div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <CompletionModal
        isOpen={status === "completed"}
        score={score}
        totalGaps={gaps.length}
        onReset={resetGame}
        exitHref={exitHref}
        exitLabel={exitLabel}
      />
    </main>
  );
}
