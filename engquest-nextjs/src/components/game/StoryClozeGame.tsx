"use client";
// Interactive Story Cloze component that turns saved game data into a playable session.

import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { motion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import CompletionModal from "@/components/game/story-cloze/CompletionModal";
import MeaningPanel from "@/components/game/story-cloze/MeaningPanel";
import ProgressBar from "@/components/game/story-cloze/ProgressBar";
import StoryTextPanel from "@/components/game/story-cloze/StoryTextPanel";
import type { StoryClozeGameData } from "@/components/game/story-cloze/types";
import { useStoryClozeGameController } from "@/components/game/story-cloze/useStoryClozeGameController";
import WordBank from "@/components/game/story-cloze/WordBank";

type StoryClozeGameProps = {
  initialGame: StoryClozeGameData;
};

export default function StoryClozeGame({
  initialGame,
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4 py-12 text-slate-900">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-xl shadow-slate-200/60">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Story Cloze
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                {initialGame.title}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Kéo thả từ vào ô trống. Nhấn “Kiểm tra” để chấm điểm.
              </p>
            </div>
            <Link
              href="/topics"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              aria-label="Quit"
            >
              <X className="h-4 w-4" />
            </Link>
          </div>

          {gaps.length > 0 && (
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>
                  {answeredCount} / {gaps.length} filled
                </span>
                <span>{progress}%</span>
              </div>
              <ProgressBar progress={progress} />
            </div>
          )}
        </header>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <section className="rounded-2xl border-2 border-slate-100 bg-white p-6 shadow-xl">
            <div className="space-y-6">
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

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-500">
                  Score: {score}/{gaps.length}
                </div>
                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={status === "checking" || status === "completed"}
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "completed" ? "Đã hoàn thành" : "Kiểm tra"}
                </button>
              </div>

              {feedback === "wrong" && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  <span>Sai rồi. Hãy thử lại nhé!</span>
                  <button
                    type="button"
                    onClick={handleRetryWrong}
                    className="rounded-full border border-red-200 bg-white px-4 py-1 text-xs font-semibold text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Thử lại
                  </button>
                </div>
              )}
            </div>
          </section>

          {selectedMeaning && <MeaningPanel selection={selectedMeaning} />}

          <WordBank availableItems={availableItems} />

          <DragOverlay dropAnimation={null}>
            {activeItem ? (
              <motion.div
                className="cursor-grabbing rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg"
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
      />
    </main>
  );
}
