"use client";

// Story content renderer that mixes static text tokens with interactive gaps.
import DroppableGap from "@/components/game/story-cloze/DroppableGap";
import type {
  StoryClozeBankItem,
  StoryClozeContentItem,
} from "@/components/game/story-cloze/types";
import { splitIntoTokens } from "@/components/game/story-cloze/utils";

type StoryTextPanelProps = {
  content: StoryClozeContentItem[];
  answerSet: Set<string>;
  userAnswers: Record<string, string>;
  filledItems: Map<string, StoryClozeBankItem>;
  wrongGaps: string[];
  onWordClick: (word: string, isAnswer: boolean) => void;
  onClearGap: (gapId: string) => void;
};

export default function StoryTextPanel({
  content,
  answerSet,
  userAnswers,
  filledItems,
  wrongGaps,
  onWordClick,
  onClearGap,
}: StoryTextPanelProps) {
  return (
    <div className="rounded-[28px] border border-black/[0.08] bg-white/76 p-6 text-lg leading-relaxed text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 sm:p-7">
      {content.map((item, index) => {
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
                onClick={() => onWordClick(token.value, isAnswer)}
                className={`mx-0.5 inline-flex items-center rounded-md px-1 text-sm font-semibold ${
                  isAnswer
                    ? "cursor-default text-slate-400 dark:text-slate-500"
                    : "text-slate-700 underline decoration-dotted underline-offset-4 hover:text-slate-950 dark:text-slate-100 dark:hover:text-white"
                }`}
              >
                {token.value}
              </button>
            );
          });
        }

        const gapId = `gap-${index}`;
        const filledId = userAnswers[gapId];
        const filledItem = filledId ? filledItems.get(filledId) : undefined;

        return (
          <DroppableGap
            key={gapId}
            id={gapId}
            filledItem={filledItem}
            isWrong={wrongGaps.includes(gapId)}
            onClear={() => onClearGap(gapId)}
          />
        );
      })}
    </div>
  );
}
