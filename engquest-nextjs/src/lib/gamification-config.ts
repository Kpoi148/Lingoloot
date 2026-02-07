export const GAMIFICATION_CONFIG = {
    XP_PER_LEVEL: 100,
    BASE_DAILY_XP: 50,
    STREAK_BONUS_PER_DAY: 10,
    WEEKLY_BONUS_XP: 150,
    WEEKLY_BONUS_GEMS: 25,
} as const;

export type LevelTitle = {
    minLevel: number;
    maxLevel?: number; // undefined means infinite/final tier
    title: string;
};

export const LEVEL_SYSTEM: LevelTitle[] = [
    { minLevel: 1, maxLevel: 4, title: "Tập sự" },
    { minLevel: 5, maxLevel: 9, title: "Học giả" },
    { minLevel: 10, maxLevel: 14, title: "Chuyên gia" },
    { minLevel: 15, title: "Bậc thầy" },
];
