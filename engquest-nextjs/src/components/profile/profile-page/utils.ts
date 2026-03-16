import { getLevelProgress, getLevelTitle } from "@/lib/gamification/gamification";
import type { UserProfile } from "@/actions/user/profile.actions";
import type { ShopCatalogItem } from "@/types/shop-item";
import type { ProfileFormState, ProfileInventorySummary } from "./types";

const numberFormatter = new Intl.NumberFormat("en-US");
const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const buildProfileFormState = (
  profile: UserProfile | null
): ProfileFormState => ({
  displayName: profile?.displayName ?? profile?.name ?? "",
  bio: profile?.bio ?? "",
  avatarUrl: profile?.avatarUrl ?? "",
});

export const formatNumber = (value: number) =>
  numberFormatter.format(Number.isFinite(value) ? value : 0);

export const normalizeAccuracy = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  if (value > 100) return 100;
  if (value < 0) return 0;
  return Math.round(value);
};

export const buildInventorySummary = (
  profile: UserProfile | null,
  shopItems: ShopCatalogItem[]
): ProfileInventorySummary => {
  if (!profile) {
    return {
      ownedItems: [],
      inventoryCount: 0,
      frameCount: 0,
      avatarCount: 0,
      equippedFrameItem: null,
      equippedAvatarItem: null,
    };
  }

  const ownedIds = new Set(profile.gamification.inventory);
  const ownedItems = shopItems.filter((item) => ownedIds.has(item._id));
  const frameItems = ownedItems.filter((item) => item.type === "frame");
  const avatarItems = ownedItems.filter((item) => item.type === "avatar");

  return {
    ownedItems,
    inventoryCount: ownedItems.length,
    frameCount: frameItems.length,
    avatarCount: avatarItems.length,
    equippedFrameItem:
      ownedItems.find((item) => item._id === profile.gamification.equippedFrame) ??
      null,
    equippedAvatarItem:
      ownedItems.find((item) => item._id === profile.gamification.equippedAvatar) ??
      null,
  };
};

export const getProfileDisplayName = (profile: UserProfile) =>
  profile.displayName || profile.name;

export const getProfileLevelState = (profile: UserProfile | null) => {
  const levelProgress = getLevelProgress(profile?.gamification.xp ?? 0);
  return {
    levelProgress,
    levelTitle: getLevelTitle(levelProgress.level),
  };
};

export const formatLastLoginDate = (value?: string | null) => {
  if (!value) return "Chưa có dữ liệu";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Chưa có dữ liệu";
  }

  return dateFormatter.format(date);
};
