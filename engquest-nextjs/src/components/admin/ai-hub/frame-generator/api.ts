// Feature-scoped wrappers around frame generation and save server actions.
import {
  generateAIFrame,
  saveAIFrameToShop,
} from "@/actions/admin/ai-shop.actions";
import type { FrameSaveData } from "@/components/admin/ai-hub/frame-generator/types";

export const requestFrameGeneration = async (prompt: string) =>
  generateAIFrame(prompt, "auto");

export const saveGeneratedFrame = async (
  payload: FrameSaveData & { imageUrl: string }
) => saveAIFrameToShop(payload);
