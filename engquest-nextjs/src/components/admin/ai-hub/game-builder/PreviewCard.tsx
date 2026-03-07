"use client";
// Preview panel for reviewing a generated Story Cloze game before saving.

import { splitIntoTokens } from "./utils";
import type { Game } from "./types";

type PreviewCardProps = {
  game: Game | null;
  answerSet: Set<string>;
  previewWordBank: string[];
  selectedMeaning: { word: string; meaning: string } | null;
  onWordClick: (word: string) => void;
};

export default function PreviewCard({
  game,
  answerSet,
  previewWordBank,
  selectedMeaning,
  onWordClick,
}: PreviewCardProps) {
  return (
    <>
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
          Live Preview
        </p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Student View
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          The preview updates when JSON is valid.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/20">
        {!game && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
            Generate or paste valid JSON to preview the game.
          </div>
        )}

        {game && (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                Story Cloze
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {game.title}
              </h3>
            </div>

            <p className="text-base leading-7 text-slate-700 dark:text-slate-300">
              {game.content.map((item, index) => {
                if (item.type === "text") {
                  return splitIntoTokens(item.text).map((token, tokenIndex) => {
                    if (!token.isWord) {
                      return (
                        <span key={`${item.text}-${index}-${tokenIndex}`}>
                          {token.value}
                        </span>
                      );
                    }
                    const isAnswer = answerSet.has(token.value.toLowerCase());
                    return (
                      <button
                        key={`${item.text}-${index}-${tokenIndex}`}
                        type="button"
                        onClick={() => {
                          if (!isAnswer) {
                            onWordClick(token.value);
                          }
                        }}
                        className={`mx-0.5 inline-flex items-center rounded-md px-1 text-sm font-semibold ${
                          isAnswer
                            ? "cursor-default text-slate-400 dark:text-slate-500"
                            : "text-slate-700 underline decoration-dotted hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                        }`}
                      >
                        {token.value}
                      </button>
                    );
                  });
                }
                return (
                  <span
                    key={`${item.text}-${index}`}
                    className="mx-1 inline-flex items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-2 py-0.5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  >
                    {item.text || "___"}
                  </span>
                );
              })}
            </p>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Word Bank
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {previewWordBank.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
            {selectedMeaning && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                <span className="font-semibold">{selectedMeaning.word}:</span>{" "}
                {selectedMeaning.meaning}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
