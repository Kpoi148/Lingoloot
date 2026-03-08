"use client";
// Admin AI tool for generating cosmetic frame assets for the shop.

import FramePreviewStage from "@/components/admin/ai-hub/frame-generator/FramePreviewStage";
import FramePromptPanel from "@/components/admin/ai-hub/frame-generator/FramePromptPanel";
import FrameSaveModal from "@/components/admin/ai-hub/frame-generator/FrameSaveModal";
import type { FrameGeneratorProps } from "@/components/admin/ai-hub/frame-generator/types";
import { useFrameGeneratorController } from "@/components/admin/ai-hub/frame-generator/useFrameGeneratorController";

export default function FrameGenerator(props: FrameGeneratorProps) {
  const {
    closeSaveModal,
    confirmSave,
    generatedImage,
    handleChipClick,
    handleGenerate,
    handleRarityChange,
    handleReset,
    handleSaveToShop,
    isGenerating,
    isSaveModalOpen,
    isSaving,
    loadingStepIndex,
    previewContext,
    prompt,
    saveData,
    setPreviewContext,
    setPrompt,
    updateSaveData,
    userAvatarUrl,
  } = useFrameGeneratorController(props);

  return (
    <div className="relative min-h-[600px] w-full overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-slate-200 shadow-2xl lg:p-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 grid gap-10 lg:grid-cols-2 lg:items-start">
        <FramePromptPanel
          prompt={prompt}
          isGenerating={isGenerating}
          loadingStepIndex={loadingStepIndex}
          onPromptChange={setPrompt}
          onChipClick={handleChipClick}
          onGenerate={handleGenerate}
        />

        <FramePreviewStage
          generatedImage={generatedImage}
          isGenerating={isGenerating}
          previewContext={previewContext}
          userAvatarUrl={userAvatarUrl}
          onPreviewContextChange={setPreviewContext}
          onReset={handleReset}
          onSaveToShop={handleSaveToShop}
        />
      </div>

      <FrameSaveModal
        generatedImage={generatedImage}
        isOpen={isSaveModalOpen}
        isSaving={isSaving}
        saveData={saveData}
        userAvatarUrl={userAvatarUrl}
        onClose={closeSaveModal}
        onConfirm={confirmSave}
        onNameChange={(value) => updateSaveData("name", value)}
        onPriceChange={(value) => updateSaveData("price", value)}
        onRarityChange={handleRarityChange}
      />
    </div>
  );
}
