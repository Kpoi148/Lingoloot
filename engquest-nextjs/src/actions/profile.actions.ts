"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import ShopItem from "@/models/ShopItem"; // Import ShopItem model

type UserStats = {
  totalVocabAdded: number;
  quizzesTaken: number;
  quizAccuracy: number;
};

type UserGamification = {
  xp: number;
  level: number;
  streak: number;
  currency: number;
  inventory: string[];
  equippedFrame?: string;
  equippedFrameDetails?: {
    renderKey?: string;
    imageUrl?: string;
  };
  equippedAvatar?: string;
  lastLoginDate?: string | null;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  displayName: string;
  bio: string;
  stats: UserStats;
  gamification: UserGamification;
};

const toUserProfile = (user: {
  _id: unknown;
  name: string;
  email: string;
  avatarUrl?: string;
  image?: string;
  displayName?: string;
  bio?: string;
  stats?: Partial<UserStats>;
  gamification?: {
    xp?: number;
    level?: number;
    streak?: number;
    currency?: number;
    inventory?: string[];
    equippedFrame?: string;
    equippedFrameDetails?: {
      renderKey?: string;
      imageUrl?: string;
    };
    equippedAvatar?: string;
    lastLoginDate?: Date | null;
  };
}): UserProfile => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl ?? user.image ?? "/avatarDefault.png",
  displayName: user.displayName ?? user.name ?? "",
  bio: user.bio ?? "",
  stats: {
    totalVocabAdded: user.stats?.totalVocabAdded ?? 0,
    quizzesTaken: user.stats?.quizzesTaken ?? 0,
    quizAccuracy: user.stats?.quizAccuracy ?? 0,
  },
  gamification: {
    xp: user.gamification?.xp ?? 0,
    level: user.gamification?.level ?? 1,
    streak: user.gamification?.streak ?? 0,
    currency: user.gamification?.currency ?? 0,
    inventory: user.gamification?.inventory ?? [],
    equippedFrame: user.gamification?.equippedFrame
      ? String(user.gamification.equippedFrame)
      : undefined,
    equippedFrameDetails: user.gamification?.equippedFrameDetails,
    equippedAvatar: user.gamification?.equippedAvatar
      ? String(user.gamification.equippedAvatar)
      : undefined,
    lastLoginDate: user.gamification?.lastLoginDate
      ? user.gamification.lastLoginDate.toISOString()
      : null,
  },
});

export async function getUserProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  await connectToDatabase();
  const user = await User.findById(session.user.id)
    .select("name email avatarUrl displayName bio stats image gamification")
    .lean();

  if (!user) {
    return null;
  }

  // Populate frame details manually if needed or simply fetch item
  let equippedFrameDetails = undefined;
  if (user.gamification?.equippedFrame) {
    const frameItem = await ShopItem.findById(user.gamification.equippedFrame).select("renderKey imageUrl").lean();
    if (frameItem) {
      equippedFrameDetails = {
        renderKey: frameItem.renderKey,
        imageUrl: frameItem.imageUrl
      };
    }
  }

  return toUserProfile({
    ...user,
    gamification: {
      ...user.gamification,
      equippedFrameDetails
    }
  });
}

export async function updateUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized." };
  }

  const nameValue = formData.get("name");
  const displayNameValue = formData.get("displayName");
  const bioValue = formData.get("bio");
  const avatarValue = formData.get("avatarUrl");

  const updates: Record<string, string> = {};

  if (typeof nameValue === "string" && nameValue.trim()) {
    updates.name = nameValue.trim();
    if (!(typeof displayNameValue === "string" && displayNameValue.trim())) {
      updates.displayName = updates.name;
    }
  }

  if (typeof displayNameValue === "string" && displayNameValue.trim()) {
    updates.displayName = displayNameValue.trim();
  }

  if (typeof bioValue === "string") {
    updates.bio = bioValue.trim();
  }

  if (typeof avatarValue === "string") {
    const avatarUrl = avatarValue.trim();
    updates.avatarUrl = avatarUrl;
    updates.image = avatarUrl;
  }

  if (Object.keys(updates).length === 0) {
    return { success: false, message: "No changes provided." };
  }

  await connectToDatabase();
  const updated = await User.findByIdAndUpdate(
    session.user.id,
    { $set: updates },
    { new: true }
  )
    .select("name email avatarUrl displayName bio stats image gamification")
    .lean();

  if (!updated) {
    return { success: false, message: "User not found." };
  }

  return { success: true, data: toUserProfile(updated) };
}
