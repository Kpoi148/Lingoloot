// Left-side control panel for composing prompts and starting frame generation.
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { LOADING_STEPS, PROMPT_CHIPS } from "@/components/admin/ai-hub/frame-generator/utils";

type FramePromptPanelProps = {
  prompt: string;
  isGenerating: boolean;
  loadingStepIndex: number;
  onPromptChange: (value: string) => void;
  onChipClick: (chip: string) => void;
  onGenerate: () => void;
};

export default function FramePromptPanel({
  prompt,
  isGenerating,
  loadingStepIndex,
  onPromptChange,
  onChipClick,
  onGenerate,
}: FramePromptPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-indigo-400">
          <Sparkles className="h-5 w-5 animate-pulse" />
          <h2 className="text-xl font-bold tracking-tight text-white">
            AI Frame Studio
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Nhập ý tưởng và để ma thuật tạo nên khung viền độc bản cho bạn.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl transition-all focus-within:border-indigo-500/50 focus-within:bg-white/10">
        <textarea
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          placeholder="Mô tả ý tưởng... (Ví dụ: Rồng lửa cuộn quanh, sấm sét tím...)"
          className="h-40 w-full resize-none bg-transparent p-5 text-lg font-medium text-white placeholder:text-slate-500 focus:outline-none"
          disabled={isGenerating}
        />

        <div className="flex flex-wrap gap-2 px-4 pb-4">
          {PROMPT_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onChipClick(chip)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-indigo-500/20 hover:text-indigo-300"
            >
              + {chip}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-indigo-600 px-6 py-5 font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:bg-indigo-500 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        {isGenerating ? (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-white/80" />
              <span className="text-white/90">
                {LOADING_STEPS[loadingStepIndex]}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
            <Wand2 className="h-5 w-5" />
            <span>Tạo Khung Ngay</span>
          </>
        )}
      </button>
    </div>
  );
}
