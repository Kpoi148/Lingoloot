"use server";

import { connectToDatabase } from "@/lib/db/mongodb";
import {
  BASE_DAILY_XP,
  STREAK_BONUS_PER_DAY,
  WEEKLY_BONUS_GEMS,
  WEEKLY_BONUS_XP,
  getLevelFromXp,
  getUtcDayDiff,
  isSameUtcDay,
  startOfUtcDay,
} from "@/lib/gamification/gamification";
import User from "@/models/User";

export type DailyLoginReward = {
  xp: number;
  gems: number;
  streak: number;
  weeklyBonus: boolean;
};

export type DailyLoginResult =
  | { status: "already-claimed" }
  | {
    status: "claimed";
    reward: DailyLoginReward;
    levelUp: boolean;
    newLevel: number;
    newXp: number;
    newCurrency: number;
  };

import { ensureAuthenticated } from "@/lib/auth/auth-utils";

export async function checkDailyLogin(userId?: string): Promise<DailyLoginResult> {
  const session = await ensureAuthenticated();
  const sessionUserId = session.user.id;
  if (userId && userId !== sessionUserId) {
    throw new Error("Forbidden.");
  }

  await connectToDatabase();

  const user = await User.findById(sessionUserId)
    .select("gamification")
    .lean();
  if (!user) {
    throw new Error("User not found.");
  }

  const gamification = user.gamification ?? {
    xp: 0,
    level: 1,
    streak: 0,
    lastLoginDate: null,
    currency: 0,
    inventory: [],
  };

  const currentXp = gamification.xp ?? 0;
  const currentLevel = gamification.level ?? getLevelFromXp(currentXp);
  const currentStreak = gamification.streak ?? 0;
  const currentCurrency = gamification.currency ?? 0;
  const lastLoginDate = gamification.lastLoginDate
    ? new Date(gamification.lastLoginDate)
    : null;

  const todayUtc = startOfUtcDay(new Date());

  if (lastLoginDate && isSameUtcDay(lastLoginDate, todayUtc)) {
    return { status: "already-claimed" };
  }

  let nextStreak = 1;
  let rewardXp = BASE_DAILY_XP;

  if (lastLoginDate) {
    const diffDays = getUtcDayDiff(lastLoginDate, todayUtc);
    if (diffDays === 1) {
      nextStreak = currentStreak + 1;
      rewardXp = BASE_DAILY_XP + nextStreak * STREAK_BONUS_PER_DAY;
    } else {
      nextStreak = 1;
      rewardXp = BASE_DAILY_XP;
    }
  }

  const weeklyBonus = nextStreak % 7 === 0;
  const bonusXp = weeklyBonus ? WEEKLY_BONUS_XP : 0;
  const bonusGems = weeklyBonus ? WEEKLY_BONUS_GEMS : 0;
  const totalRewardXp = rewardXp + bonusXp;

  const newXp = currentXp + totalRewardXp;
  const newLevel = getLevelFromXp(newXp);
  const levelUp = newLevel > currentLevel;
  const newCurrency = currentCurrency + bonusGems;

  await User.findByIdAndUpdate(
    sessionUserId,
    {
      $set: {
        "gamification.xp": newXp,
        "gamification.level": newLevel,
        "gamification.streak": nextStreak,
        "gamification.lastLoginDate": todayUtc,
        "gamification.currency": newCurrency,
      },
    },
    { new: false }
  );

  return {
    status: "claimed",
    reward: {
      xp: totalRewardXp,
      gems: bonusGems,
      streak: nextStreak,
      weeklyBonus,
    },
    levelUp,
    newLevel,
    newXp,
    newCurrency,
  };
}
