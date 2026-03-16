import type { FormEvent } from "react";

import type { UserProfile } from "@/actions/user/profile.actions";
import type { ShopCatalogItem } from "@/types/shop-item";

export type ProfileFormState = {
  displayName: string;
  bio: string;
  avatarUrl: string;
};

export type ProfileInventorySummary = {
  ownedItems: ShopCatalogItem[];
  inventoryCount: number;
  frameCount: number;
  avatarCount: number;
  equippedFrameItem: ShopCatalogItem | null;
  equippedAvatarItem: ShopCatalogItem | null;
};

export type ProfileClientProps = {
  initialProfile: UserProfile | null;
  initialError?: string | null;
  shopItems?: ShopCatalogItem[];
};

export type ProfileLevelProgress = {
  level: number;
  progress: number;
  required: number;
  remaining: number;
  percent: number;
};

export type ProfileUnifiedFormProps = {
  profile: UserProfile;
  formState: ProfileFormState;
  inventorySummary: ProfileInventorySummary;
  levelProgress: ProfileLevelProgress;
  levelTitle: string;
  isSaving: boolean;
  onReset: () => void;
  onSignOut: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onFieldChange: (field: keyof ProfileFormState, value: string) => void;
};
