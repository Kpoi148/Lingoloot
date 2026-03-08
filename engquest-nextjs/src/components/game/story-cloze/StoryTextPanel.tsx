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
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-6 text-lg leading-relaxed text-slate-700">
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
                    ? "cursor-default text-slate-400"
                    : "text-slate-700 underline decoration-dotted hover:text-slate-900"
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
