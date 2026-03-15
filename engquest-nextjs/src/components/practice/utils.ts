import { isRecent } from "@/lib/shared/utils";
import type {
  PracticeGameRecord,
  PracticeSummary,
  PracticeTheme,
  PracticeTopicOption,
} from "@/components/practice/types";
import type { StoryClozeContentItem } from "@/components/game/story-cloze/types";

const PRACTICE_THEMES: PracticeTheme[] = [
  {
    glowClass:
      "from-sky-300/90 via-cyan-200/70 to-transparent dark:from-sky-500/26 dark:via-cyan-400/8 dark:to-transparent",
    iconClass:
      "bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-[0_18px_44px_-22px_rgba(3,105,161,0.72)]",
    cardBorderClass: "border-sky-200/70 dark:border-sky-400/14",
    previewClass:
      "border-sky-200/80 bg-sky-500/[0.08] dark:border-sky-400/18 dark:bg-sky-500/[0.1]",
    buttonClass:
      "bg-sky-600 text-white hover:bg-sky-500 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300",
    buttonGhostClass:
      "border-sky-200/80 bg-sky-500/[0.08] text-sky-800 hover:bg-sky-500/[0.14] dark:border-sky-400/18 dark:bg-sky-500/[0.12] dark:text-sky-100 dark:hover:bg-sky-500/[0.18]",
    badgeClass:
      "border-sky-200/80 bg-sky-500/[0.1] text-sky-800 dark:border-sky-400/18 dark:bg-sky-500/[0.16] dark:text-sky-100",
  },
  {
    glowClass:
      "from-amber-300/90 via-orange-200/70 to-transparent dark:from-amber-500/26 dark:via-orange-400/8 dark:to-transparent",
    iconClass:
      "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-[0_18px_44px_-22px_rgba(217,119,6,0.72)]",
    cardBorderClass: "border-amber-200/70 dark:border-amber-400/14",
    previewClass:
      "border-amber-200/80 bg-amber-500/[0.08] dark:border-amber-400/18 dark:bg-amber-500/[0.1]",
    buttonClass:
      "bg-amber-500 text-white hover:bg-amber-400 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300",
    buttonGhostClass:
      "border-amber-200/80 bg-amber-500/[0.08] text-amber-900 hover:bg-amber-500/[0.14] dark:border-amber-400/18 dark:bg-amber-500/[0.12] dark:text-amber-100 dark:hover:bg-amber-500/[0.18]",
    badgeClass:
      "border-amber-200/80 bg-amber-500/[0.1] text-amber-900 dark:border-amber-400/18 dark:bg-amber-500/[0.16] dark:text-amber-100",
  },
  {
    glowClass:
      "from-violet-300/90 via-fuchsia-200/70 to-transparent dark:from-violet-500/26 dark:via-fuchsia-400/8 dark:to-transparent",
    iconClass:
      "bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-[0_18px_44px_-22px_rgba(109,40,217,0.72)]",
    cardBorderClass: "border-violet-200/70 dark:border-violet-400/14",
    previewClass:
      "border-violet-200/80 bg-violet-500/[0.08] dark:border-violet-400/18 dark:bg-violet-500/[0.1]",
    buttonClass:
      "bg-violet-600 text-white hover:bg-violet-500 dark:bg-violet-400 dark:text-slate-950 dark:hover:bg-violet-300",
    buttonGhostClass:
      "border-violet-200/80 bg-violet-500/[0.08] text-violet-800 hover:bg-violet-500/[0.14] dark:border-violet-400/18 dark:bg-violet-500/[0.12] dark:text-violet-100 dark:hover:bg-violet-500/[0.18]",
    badgeClass:
      "border-violet-200/80 bg-violet-500/[0.1] text-violet-800 dark:border-violet-400/18 dark:bg-violet-500/[0.16] dark:text-violet-100",
  },
  {
    glowClass:
      "from-emerald-300/90 via-teal-200/70 to-transparent dark:from-emerald-500/26 dark:via-teal-400/8 dark:to-transparent",
    iconClass:
      "bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-[0_18px_44px_-22px_rgba(5,150,105,0.72)]",
    cardBorderClass: "border-emerald-200/70 dark:border-emerald-400/14",
    previewClass:
      "border-emerald-200/80 bg-emerald-500/[0.08] dark:border-emerald-400/18 dark:bg-emerald-500/[0.1]",
    buttonClass:
      "bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300",
    buttonGhostClass:
      "border-emerald-200/80 bg-emerald-500/[0.08] text-emerald-800 hover:bg-emerald-500/[0.14] dark:border-emerald-400/18 dark:bg-emerald-500/[0.12] dark:text-emerald-100 dark:hover:bg-emerald-500/[0.18]",
    badgeClass:
      "border-emerald-200/80 bg-emerald-500/[0.1] text-emerald-800 dark:border-emerald-400/18 dark:bg-emerald-500/[0.16] dark:text-emerald-100",
  },
];

export function buildPracticePreview(content: StoryClozeContentItem[]) {
  const normalized = content
    .map((item) => (item.type === "gap" ? "____" : item.text))
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/\s([,.;!?])/g, "$1")
    .trim();

  if (!normalized) {
    return "____";
  }

  return normalized.length > 118
    ? `${normalized.slice(0, 118).trimEnd()}...`
    : normalized;
}

export function countPracticeGaps(content: StoryClozeContentItem[]) {
  return content.filter((item) => item.type === "gap").length;
}

export function estimatePracticeMinutes(
  gapCount: number,
  distractorCount: number
) {
  return Math.max(2, Math.round(gapCount * 0.55 + distractorCount * 0.18));
}

export function formatPracticeDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function isPracticeFresh(game: PracticeGameRecord) {
  if (!game.createdAt) {
    return false;
  }

  return isRecent(new Date(game.createdAt), 5);
}

export function getPracticeSummary(
  games: PracticeGameRecord[]
): PracticeSummary {
  const topicNames = new Set(games.map((game) => game.topicName));

  return {
    totalGames: games.length,
    totalTopics: topicNames.size,
    totalGaps: games.reduce((sum, game) => sum + game.gapCount, 0),
    freshGames: games.filter(isPracticeFresh).length,
  };
}

export function getPracticeTopicOptions(
  games: PracticeGameRecord[]
): PracticeTopicOption[] {
  const counts = new Map<string, number>();

  games.forEach((game) => {
    counts.set(game.topicName, (counts.get(game.topicName) ?? 0) + 1);
  });

  return [
    {
      id: "all",
      label: "Tất cả",
      count: games.length,
    },
    ...Array.from(counts.entries())
      .sort((left, right) => left[0].localeCompare(right[0], "vi"))
      .map(([label, count]) => ({
        id: label,
        label,
        count,
      })),
  ];
}

export function filterPracticeGames(
  games: PracticeGameRecord[],
  activeTopic: string,
  query: string
) {
  const normalizedQuery = query.trim().toLowerCase();

  return [...games]
    .filter((game) => {
      const matchesTopic =
        activeTopic === "all" || game.topicName === activeTopic;
      const matchesQuery =
        !normalizedQuery ||
        [game.title, game.topicName, game.preview].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        );

      return matchesTopic && matchesQuery;
    })
    .sort((left, right) => {
      const leftDate = left.createdAt ? new Date(left.createdAt).getTime() : 0;
      const rightDate = right.createdAt
        ? new Date(right.createdAt).getTime()
        : 0;

      return rightDate - leftDate || right.gapCount - left.gapCount;
    });
}

export function getPracticeTheme(topicName: string) {
  const seed = Array.from(topicName).reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0
  );

  return PRACTICE_THEMES[seed % PRACTICE_THEMES.length];
}
