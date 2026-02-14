"use server";

import { getSession } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import ShopItem from "@/models/ShopItem"; // Import ShopItem model
import { ActionResponse } from "@/types/action-response";
import { userProfileSchema } from "@/lib/validations/user";

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
  const session = await getSession();
  if (!session?.user?.id) {
    return null;
  }

  await connectToDatabase();
  const user = await User.findById(session.user.id)
    .select("name email avatarUrl displayName bio stats image gamification role") // Select role
    .lean();

  if (user && user.role === "admin") {
    const allShopItems = await ShopItem.find({ isActive: true }).select("_id").lean();
    const allItemIds = allShopItems.map(item => String(item._id));

    // Ensure user.gamification exists
    if (!user.gamification) {
      user.gamification = { inventory: [], xp: 0, level: 1, streak: 0, currency: 0, lastLoginDate: null };
    }

    // Merge existing inventory with all shop items (using Set to avoid duplicates)
    const existingInventory = user.gamification.inventory || [];
    user.gamification.inventory = Array.from(new Set([...existingInventory, ...allItemIds]));
  }

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



export async function updateUserProfile(formData: FormData): Promise<ActionResponse<UserProfile>> {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized." };
  }

  const rawInput = {
    displayName: formData.get("displayName")?.toString(),
    bio: formData.get("bio")?.toString(),
    avatarUrl: formData.get("avatarUrl")?.toString(),
  };

  const validationResult = userProfileSchema.safeParse(rawInput);

  if (!validationResult.success) {
    const errors: Record<string, string[]> = {};
    validationResult.error.issues.forEach((err) => {
      const path = err.path[0] as string;
      if (!errors[path]) errors[path] = [];
      errors[path].push(err.message);
    });
    return {
      success: false,
      message: "Dữ liệu không hợp lệ.",
      errors,
    };
  }

  const { displayName, bio, avatarUrl } = validationResult.data;
  const updates: Record<string, string> = {};

  if (displayName !== undefined && displayName.trim() !== "") updates.displayName = displayName.trim();
  if (bio !== undefined) updates.bio = bio.trim();
  if (avatarUrl !== undefined && avatarUrl.trim() !== "") {
    updates.avatarUrl = avatarUrl.trim();
    updates.image = avatarUrl.trim();
  }

  if (Object.keys(updates).length === 0) {
    return { success: false, message: "Không có thay đổi nào." };
  }

  try {
    await connectToDatabase();
    const updated = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updates },
      { new: true }
    )
      .select("name email avatarUrl displayName bio stats image gamification role")
      .lean();

    if (!updated) {
      return { success: false, message: "Không tìm thấy người dùng." };
    }

    // Ensure gamification structure for consistent formatting
    if (!updated.gamification) {
      updated.gamification = {
        inventory: [],
        xp: 0,
        level: 1,
        streak: 0,
        currency: 0,
        lastLoginDate: null
      };
    }

    return { success: true, message: "Cập nhật thành công.", data: toUserProfile(updated) };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, message: "Lỗi hệ thống khi cập nhật hồ sơ." };
  }
}
