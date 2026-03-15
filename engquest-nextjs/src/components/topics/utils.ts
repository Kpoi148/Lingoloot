import { isRecent } from "@/lib/shared/utils";
import type {
  TopicAction,
  TopicFilterId,
  TopicRecord,
  TopicStatus,
  TopicSummary,
  TopicTheme,
} from "@/components/topics/types";

const DEFAULT_THEME: TopicTheme = {
  accentLabel: "Explorer track",
  glowClass:
    "from-slate-200/90 via-sky-100/70 to-transparent dark:from-slate-700/50 dark:via-sky-500/10 dark:to-transparent",
  iconClass:
    "bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-[0_18px_40px_-22px_rgba(15,23,42,0.85)] dark:from-slate-200 dark:to-white dark:text-slate-950 dark:shadow-[0_18px_40px_-22px_rgba(148,163,184,0.65)]",
  softPanelClass:
    "border-black/[0.07] bg-black/[0.03] text-slate-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100",
  cardBorderClass: "border-black/[0.08] dark:border-white/10",
  progressClass:
    "from-slate-700 via-sky-500 to-cyan-400 dark:from-slate-100 dark:via-sky-300 dark:to-cyan-300",
  buttonClass:
    "bg-slate-900 text-white shadow-[0_20px_45px_-25px_rgba(15,23,42,0.8)] hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100",
  subtleButtonClass:
    "border-black/[0.08] bg-white/75 text-slate-700 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:bg-white/[0.08]",
};

const TOPIC_THEMES: Record<string, TopicTheme> = {
  "giao-thong": {
    accentLabel: "Global route",
    glowClass:
      "from-sky-300/90 via-cyan-200/70 to-transparent dark:from-sky-500/30 dark:via-cyan-400/10 dark:to-transparent",
    iconClass:
      "bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-[0_20px_44px_-24px_rgba(14,116,144,0.75)]",
    softPanelClass:
      "border-sky-200/80 bg-sky-500/[0.08] text-sky-900 dark:border-sky-400/20 dark:bg-sky-500/[0.14] dark:text-sky-100",
    cardBorderClass: "border-sky-200/80 dark:border-sky-400/15",
    progressClass:
      "from-sky-500 via-cyan-400 to-emerald-300 dark:from-sky-300 dark:via-cyan-300 dark:to-emerald-200",
    buttonClass:
      "bg-sky-600 text-white shadow-[0_20px_44px_-24px_rgba(2,132,199,0.72)] hover:bg-sky-500 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300",
    subtleButtonClass:
      "border-sky-200/80 bg-sky-500/[0.08] text-sky-800 hover:bg-sky-500/[0.14] dark:border-sky-400/20 dark:bg-sky-500/[0.12] dark:text-sky-100 dark:hover:bg-sky-500/[0.18]",
  },
  "cong-so": {
    accentLabel: "Office lab",
    glowClass:
      "from-violet-300/90 via-fuchsia-200/70 to-transparent dark:from-violet-500/30 dark:via-fuchsia-400/10 dark:to-transparent",
    iconClass:
      "bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-[0_20px_44px_-24px_rgba(124,58,237,0.72)]",
    softPanelClass:
      "border-violet-200/80 bg-violet-500/[0.08] text-violet-900 dark:border-violet-400/20 dark:bg-violet-500/[0.14] dark:text-violet-100",
    cardBorderClass: "border-violet-200/80 dark:border-violet-400/15",
    progressClass:
      "from-violet-500 via-fuchsia-400 to-rose-300 dark:from-violet-300 dark:via-fuchsia-300 dark:to-rose-200",
    buttonClass:
      "bg-violet-600 text-white shadow-[0_20px_44px_-24px_rgba(109,40,217,0.7)] hover:bg-violet-500 dark:bg-violet-400 dark:text-slate-950 dark:hover:bg-violet-300",
    subtleButtonClass:
      "border-violet-200/80 bg-violet-500/[0.08] text-violet-800 hover:bg-violet-500/[0.14] dark:border-violet-400/20 dark:bg-violet-500/[0.12] dark:text-violet-100 dark:hover:bg-violet-500/[0.18]",
  },
  "am-thuc": {
    accentLabel: "Taste quest",
    glowClass:
      "from-amber-300/90 via-orange-200/70 to-transparent dark:from-amber-500/30 dark:via-orange-400/10 dark:to-transparent",
    iconClass:
      "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-[0_20px_44px_-24px_rgba(245,158,11,0.7)]",
    softPanelClass:
      "border-amber-200/80 bg-amber-500/[0.08] text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/[0.14] dark:text-amber-100",
    cardBorderClass: "border-amber-200/80 dark:border-amber-400/15",
    progressClass:
      "from-amber-500 via-orange-400 to-rose-300 dark:from-amber-300 dark:via-orange-300 dark:to-rose-200",
    buttonClass:
      "bg-amber-500 text-white shadow-[0_20px_44px_-24px_rgba(234,88,12,0.72)] hover:bg-amber-400 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300",
    subtleButtonClass:
      "border-amber-200/80 bg-amber-500/[0.08] text-amber-900 hover:bg-amber-500/[0.14] dark:border-amber-400/20 dark:bg-amber-500/[0.12] dark:text-amber-100 dark:hover:bg-amber-500/[0.18]",
  },
  "hoc-thuat": {
    accentLabel: "Knowledge arc",
    glowClass:
      "from-emerald-300/90 via-teal-200/70 to-transparent dark:from-emerald-500/30 dark:via-teal-400/10 dark:to-transparent",
    iconClass:
      "bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-[0_20px_44px_-24px_rgba(5,150,105,0.72)]",
    softPanelClass:
      "border-emerald-200/80 bg-emerald-500/[0.08] text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-500/[0.14] dark:text-emerald-100",
    cardBorderClass: "border-emerald-200/80 dark:border-emerald-400/15",
    progressClass:
      "from-emerald-500 via-teal-400 to-cyan-300 dark:from-emerald-300 dark:via-teal-300 dark:to-cyan-200",
    buttonClass:
      "bg-emerald-600 text-white shadow-[0_20px_44px_-24px_rgba(16,185,129,0.72)] hover:bg-emerald-500 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300",
    subtleButtonClass:
      "border-emerald-200/80 bg-emerald-500/[0.08] text-emerald-800 hover:bg-emerald-500/[0.14] dark:border-emerald-400/20 dark:bg-emerald-500/[0.12] dark:text-emerald-100 dark:hover:bg-emerald-500/[0.18]",
  },
  "ngu-phap": {
    accentLabel: "Logic chamber",
    glowClass:
      "from-rose-300/90 via-pink-200/70 to-transparent dark:from-rose-500/30 dark:via-pink-400/10 dark:to-transparent",
    iconClass:
      "bg-gradient-to-br from-rose-600 to-pink-500 text-white shadow-[0_20px_44px_-24px_rgba(244,63,94,0.72)]",
    softPanelClass:
      "border-rose-200/80 bg-rose-500/[0.08] text-rose-900 dark:border-rose-400/20 dark:bg-rose-500/[0.14] dark:text-rose-100",
    cardBorderClass: "border-rose-200/80 dark:border-rose-400/15",
    progressClass:
      "from-rose-500 via-pink-400 to-orange-300 dark:from-rose-300 dark:via-pink-300 dark:to-orange-200",
    buttonClass:
      "bg-rose-600 text-white shadow-[0_20px_44px_-24px_rgba(225,29,72,0.72)] hover:bg-rose-500 dark:bg-rose-400 dark:text-slate-950 dark:hover:bg-rose-300",
    subtleButtonClass:
      "border-rose-200/80 bg-rose-500/[0.08] text-rose-800 hover:bg-rose-500/[0.14] dark:border-rose-400/20 dark:bg-rose-500/[0.12] dark:text-rose-100 dark:hover:bg-rose-500/[0.18]",
  },
  "luyen-nghe": {
    accentLabel: "Sound sprint",
    glowClass:
      "from-cyan-300/90 via-blue-200/70 to-transparent dark:from-cyan-500/30 dark:via-blue-400/10 dark:to-transparent",
    iconClass:
      "bg-gradient-to-br from-cyan-600 to-blue-500 text-white shadow-[0_20px_44px_-24px_rgba(8,145,178,0.72)]",
    softPanelClass:
      "border-cyan-200/80 bg-cyan-500/[0.08] text-cyan-900 dark:border-cyan-400/20 dark:bg-cyan-500/[0.14] dark:text-cyan-100",
    cardBorderClass: "border-cyan-200/80 dark:border-cyan-400/15",
    progressClass:
      "from-cyan-500 via-blue-400 to-violet-300 dark:from-cyan-300 dark:via-blue-300 dark:to-violet-200",
    buttonClass:
      "bg-cyan-600 text-white shadow-[0_20px_44px_-24px_rgba(6,182,212,0.72)] hover:bg-cyan-500 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300",
    subtleButtonClass:
      "border-cyan-200/80 bg-cyan-500/[0.08] text-cyan-800 hover:bg-cyan-500/[0.14] dark:border-cyan-400/20 dark:bg-cyan-500/[0.12] dark:text-cyan-100 dark:hover:bg-cyan-500/[0.18]",
  },
};

export const TOPIC_FILTERS = [
  {
    id: "all",
    label: "Tất cả",
    hint: "Toàn bộ chặng học đang có",
  },
  {
    id: "in-progress",
    label: "Đang học",
    hint: "Chủ đề bạn đã bắt đầu",
  },
  {
    id: "completed",
    label: "Hoàn thành",
    hint: "Đã xong flashcards và quiz",
  },
  {
    id: "new",
    label: "Mới cập nhật",
    hint: "Có nội dung mới gần đây",
  },
] as const;

const STATUS_PRIORITY: Record<TopicStatus, number> = {
  "in-progress": 0,
  new: 1,
  "not-started": 2,
  completed: 3,
};

export function getTopicTheme(slug: string): TopicTheme {
  return TOPIC_THEMES[slug] ?? DEFAULT_THEME;
}

export function isTopicNew(topic: TopicRecord): boolean {
  if (!topic.lastContentUpdatedAt) {
    return false;
  }

  const parsedDate = new Date(topic.lastContentUpdatedAt);
  return isRecent(parsedDate);
}

export function getTopicStatus(topic: TopicRecord): TopicStatus {
  if (topic.progress >= 100) {
    return "completed";
  }

  if (topic.progress > 0) {
    return "in-progress";
  }

  if (isTopicNew(topic)) {
    return "new";
  }

  return "not-started";
}

export function getTopicStatusMeta(status: TopicStatus) {
  switch (status) {
    case "completed":
      return {
        label: "Hoàn thành",
        className:
          "border-emerald-200/80 bg-emerald-500/[0.12] text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/[0.18] dark:text-emerald-100",
      };
    case "in-progress":
      return {
        label: "Đang học",
        className:
          "border-sky-200/80 bg-sky-500/[0.12] text-sky-800 dark:border-sky-400/20 dark:bg-sky-500/[0.18] dark:text-sky-100",
      };
    case "new":
      return {
        label: "Mới mở",
        className:
          "border-amber-200/80 bg-amber-500/[0.12] text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/[0.18] dark:text-amber-100",
      };
    default:
      return {
        label: "Chưa bắt đầu",
        className:
          "border-black/[0.08] bg-black/[0.03] text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200",
      };
  }
}

export function getTopicMilestones(progress: number) {
  return {
    vocabDone: progress >= 50,
    quizDone: progress >= 100,
  };
}

export function getTopicSummary(topics: TopicRecord[]): TopicSummary {
  const totalTopics = topics.length;
  const completedTopics = topics.filter((topic) => topic.progress >= 100).length;
  const activeTopics = topics.filter(
    (topic) => topic.progress > 0 && topic.progress < 100
  ).length;
  const totalWords = topics.reduce((sum, topic) => sum + topic.count, 0);
  const freshTopics = topics.filter(isTopicNew).length;
  const averageProgress = totalTopics
    ? Math.round(
        topics.reduce((sum, topic) => sum + topic.progress, 0) / totalTopics
      )
    : 0;

  return {
    totalTopics,
    completedTopics,
    activeTopics,
    totalWords,
    freshTopics,
    averageProgress,
  };
}

function sortTopicsByPriority(topics: TopicRecord[]) {
  return [...topics].sort((left, right) => {
    const leftStatus = getTopicStatus(left);
    const rightStatus = getTopicStatus(right);
    const statusDiff = STATUS_PRIORITY[leftStatus] - STATUS_PRIORITY[rightStatus];

    if (statusDiff !== 0) {
      return statusDiff;
    }

    if (leftStatus === "in-progress" && rightStatus === "in-progress") {
      return right.progress - left.progress || left.order - right.order;
    }

    if (leftStatus === "completed" && rightStatus === "completed") {
      return left.order - right.order;
    }

    return left.order - right.order;
  });
}

export function getRecommendedTopic(topics: TopicRecord[]) {
  return sortTopicsByPriority(topics)[0] ?? null;
}

export function filterTopics(
  topics: TopicRecord[],
  activeFilter: TopicFilterId,
  query: string
) {
  const normalizedQuery = query.trim().toLowerCase();

  const filteredTopics = topics.filter((topic) => {
    const status = getTopicStatus(topic);
    const matchesQuery =
      !normalizedQuery ||
      [topic.name, topic.description, topic.slug]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery));

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "in-progress" && status === "in-progress") ||
      (activeFilter === "completed" && status === "completed") ||
      (activeFilter === "new" && isTopicNew(topic));

    return matchesQuery && matchesFilter;
  });

  return sortTopicsByPriority(filteredTopics);
}

export function getPrimaryTopicAction(topic: TopicRecord): TopicAction {
  if (topic.progress >= 50 && topic.progress < 100) {
    return {
      label: "Làm quiz ngay",
      href: `/learning/${topic.slug}/quiz`,
    };
  }

  if (topic.progress >= 100) {
    return {
      label: "Ôn lại flashcards",
      href: `/learning/${topic.slug}/flashcards`,
    };
  }

  return {
    label: topic.progress > 0 ? "Tiếp tục flashcards" : "Bắt đầu flashcards",
    href: `/learning/${topic.slug}/flashcards`,
  };
}

export function getSecondaryTopicAction(topic: TopicRecord): TopicAction {
  if (topic.progress >= 50 && topic.progress < 100) {
    return {
      label: "Mở chủ đề",
      href: `/learning/${topic.slug}`,
    };
  }

  return {
    label: "Làm quiz",
    href: `/learning/${topic.slug}/quiz`,
  };
}
