// Preview stage that renders the generated frame in multiple visual contexts.
import { RefreshCw, Save } from "lucide-react";
import { FrameRenderer } from "@/components/shop/FrameRenderer";
import type { PreviewContext } from "@/components/admin/ai-hub/frame-generator/types";

type FramePreviewStageProps = {
  generatedImage: string | null;
  isGenerating: boolean;
  previewContext: PreviewContext;
  userAvatarUrl?: string;
  onPreviewContextChange: (context: PreviewContext) => void;
  onReset: () => void;
  onSaveToShop: () => void;
};

const PREVIEW_CONTEXTS: PreviewContext[] = ["dark", "light", "profile"];

export default function FramePreviewStage({
  generatedImage,
  isGenerating,
  previewContext,
  userAvatarUrl,
  onPreviewContextChange,
  onReset,
  onSaveToShop,
}: FramePreviewStageProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end pr-2">
        <div className="flex rounded-lg bg-slate-900/50 p-1 ring-1 ring-white/10 backdrop-blur-md">
          {PREVIEW_CONTEXTS.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onPreviewContextChange(mode)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                previewContext === mode
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {mode === "dark" ? "Dark" : mode === "light" ? "Light" : "UI Mock"}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`
          relative flex min-h-[450px] flex-col items-center justify-center rounded-[2.5rem] border border-white/5 transition-all duration-500
          ${previewContext === "dark" ? "bg-slate-900/40" : ""}
          ${previewContext === "light" ? "bg-slate-200" : ""}
          ${previewContext === "profile" ? "border-slate-800 bg-slate-900" : ""}
        `}
      >
        {previewContext === "dark" && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />
        )}

        {previewContext === "profile" && (
          <div className="pointer-events-none absolute inset-0 select-none px-6 py-12 opacity-30">
            <div className="mx-auto mb-8 h-4 w-1/3 rounded bg-slate-700" />
            <div className="space-y-3">
              <div className="h-2 w-full rounded bg-slate-800" />
              <div className="h-2 w-5/6 rounded bg-slate-800" />
              <div className="h-2 w-4/6 rounded bg-slate-800" />
            </div>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center">
          <div className="group relative">
            <div className="relative h-40 w-40 transition-transform duration-500 hover:scale-105">
              <FrameRenderer
                fallbackImageUrl={generatedImage || undefined}
                avatarUrl={userAvatarUrl}
                className="h-full w-full"
              />
            </div>

            <div className="pointer-events-none absolute -bottom-[1px] left-0 right-0 h-40 w-40 origin-bottom scale-y-[-1] opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black)]">
              <FrameRenderer
                fallbackImageUrl={generatedImage || undefined}
                avatarUrl={userAvatarUrl}
                className="h-full w-full grayscale blur-[1px]"
              />
            </div>
          </div>
        </div>

        {generatedImage && (
          <div className="absolute bottom-8 flex gap-3 animate-in slide-in-from-bottom-4 fade-in duration-700">
            <button
              type="button"
              onClick={onReset}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
              title="Hủy / Làm lại"
            >
              <RefreshCw className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={onSaveToShop}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:shadow-emerald-500/40"
            >
              <Save className="h-5 w-5" />
              <span>Lưu vào Shop</span>
            </button>
          </div>
        )}

        {!generatedImage && !isGenerating && (
          <div className="absolute bottom-12 text-center text-slate-500">
            <p className="text-sm">Chưa có thiết kế</p>
          </div>
        )}
      </div>
    </div>
  );
}
