// Static configuration and view helpers for the AI frame generator.
import type {
  FrameRarity,
  FrameSaveData,
} from "@/components/admin/ai-hub/frame-generator/types";

export const PROMPT_CHIPS = [
  "Neon",
  "Fire",
  "Gold",
  "Minimalist",
  "Cyberpunk",
  "Mystic",
  "Floral",
] as const;

export const LOADING_STEPS = [
  "Analyzing Ether...",
  "Forging Geometry...",
  "Infusing Magic...",
  "Finalizing Art...",
] as const;

export const INITIAL_FRAME_SAVE_DATA: FrameSaveData = {
  name: "My Epic Frame",
  price: 100,
  rarity: "rare",
};

export const getRarityColor = (rarity: FrameRarity) => {
  switch (rarity) {
    case "legendary":
      return "border-amber-400 shadow-amber-500/20";
    case "rare":
      return "border-blue-500 shadow-blue-500/20";
    default:
      return "border-slate-500 shadow-slate-500/20";
  }
};

export const getRarityText = (rarity: FrameRarity) => {
  switch (rarity) {
    case "legendary":
      return "text-amber-400";
    case "rare":
      return "text-blue-400";
    default:
      return "text-slate-400";
  }
};
