"use client";

// Controller hook that manages prompt state, preview state, and save flow for AI frames.
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import {
  requestFrameGeneration,
  saveGeneratedFrame,
} from "@/components/admin/ai-hub/frame-generator/api";
import type {
  FrameGeneratorProps,
  FrameRarity,
  FrameSaveData,
  PreviewContext,
} from "@/components/admin/ai-hub/frame-generator/types";
import {
  INITIAL_FRAME_SAVE_DATA,
  LOADING_STEPS,
} from "@/components/admin/ai-hub/frame-generator/utils";

export function useFrameGeneratorController({
  userAvatarUrl,
}: FrameGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, startGeneration] = useTransition();
  const [isSaving, startSaving] = useTransition();
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [previewContext, setPreviewContext] =
    useState<PreviewContext>("dark");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveData, setSaveData] =
    useState<FrameSaveData>(INITIAL_FRAME_SAVE_DATA);

  useEffect(() => {
    if (!isGenerating) {
      setLoadingStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleChipClick = (chip: string) => {
    setPrompt((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${chip}` : chip;
    });
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Vui lòng nhập mô tả ý tưởng!");
      return;
    }

    startGeneration(async () => {
      const result = await requestFrameGeneration(prompt.trim());
      if (!result.success || !result.imageUrl) {
        toast.error(result.message || "Có lỗi xảy ra khi tạo khung.");
        return;
      }

      setGeneratedImage(result.imageUrl);
      toast.success("Đã tạo khung thành công! 🎨");
    });
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setPrompt("");
  };

  const handleSaveToShop = () => {
    if (!generatedImage) return;
    setIsSaveModalOpen(true);
  };

  const closeSaveModal = () => {
    setIsSaveModalOpen(false);
  };

  const updateSaveData = <K extends keyof FrameSaveData>(
    field: K,
    value: FrameSaveData[K]
  ) => {
    setSaveData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRarityChange = (rarity: FrameRarity) => {
    updateSaveData("rarity", rarity);
  };

  const confirmSave = () => {
    if (!generatedImage) return;
    if (!saveData.name.trim()) {
      toast.error("Vui lòng đặt tên cho khung!");
      return;
    }

    startSaving(async () => {
      const result = await saveGeneratedFrame({
        ...saveData,
        name: saveData.name.trim(),
        imageUrl: generatedImage,
      });

      if (!result.success) {
        toast.error("Lỗi khi lưu vào Shop.");
        return;
      }

      toast.success("Đã lưu khung vào Shop! 🛍️");
      setIsSaveModalOpen(false);
      setSaveData(INITIAL_FRAME_SAVE_DATA);
      handleReset();
    });
  };

  return {
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
    closeSaveModal,
  };
}
