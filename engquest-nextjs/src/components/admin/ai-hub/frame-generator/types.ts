// Local contracts for the AI frame generator feature.
export type FrameGeneratorProps = {
  userAvatarUrl?: string;
};

export type PreviewContext = "dark" | "light" | "profile";

export type FrameRarity = "common" | "rare" | "legendary";

export type FrameSaveData = {
  name: string;
  price: number;
  rarity: FrameRarity;
};
