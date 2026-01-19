const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const BASE_DAILY_XP = 50;
export const STREAK_BONUS_PER_DAY = 10;
export const WEEKLY_BONUS_XP = 150;
export const WEEKLY_BONUS_GEMS = 25;
export const XP_PER_LEVEL = 100;

export const startOfUtcDay = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

export const isSameUtcDay = (a: Date, b: Date) =>
  startOfUtcDay(a).getTime() === startOfUtcDay(b).getTime();

export const getUtcDayDiff = (from: Date, to: Date) =>
  Math.floor(
    (startOfUtcDay(to).getTime() - startOfUtcDay(from).getTime()) / MS_PER_DAY
  );

export const getLevelFromXp = (xp: number) =>
  Math.max(1, Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1);

export const getLevelTitle = (level: number) => {
  if (level < 5) return "Apprentice";
  if (level < 10) return "Scholar";
  if (level < 15) return "Expert";
  return "Master";
};

export const getLevelProgress = (xp: number) => {
  const level = getLevelFromXp(xp);
  const currentLevelXp = (level - 1) * XP_PER_LEVEL;
  const nextLevelXp = level * XP_PER_LEVEL;
  const progress = Math.max(0, xp - currentLevelXp);
  const required = nextLevelXp - currentLevelXp;
  const percent =
    required === 0 ? 0 : Math.min(100, Math.round((progress / required) * 100));

  return {
    level,
    currentLevelXp,
    nextLevelXp,
    progress,
    required,
    percent,
    remaining: Math.max(0, nextLevelXp - xp),
  };
};
