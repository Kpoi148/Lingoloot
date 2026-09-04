import { isRecent } from "@/lib/shared/utils";
import type {
  TopicAction,
  TopicFilterId,
  TopicRecord,
  TopicStatus,
  TopicSummary,
} from "@/components/topics/types";

const DEFAULT_TRACK_LABEL = "Hành trình từ vựng";

const TOPIC_TRACK_LABELS: Record<string, string> = {
  "giao-thong": "Giao tiếp trên hành trình",
  "cong-so": "Tình huống công việc",
  "am-thuc": "Khám phá ẩm thực",
  "hoc-thuat": "Đọc hiểu học thuật",
  "ngu-phap": "Cấu trúc và logic",
  "luyen-nghe": "Phản xạ âm thanh",
  "ngay-thang-mua": "Thời gian và lịch",
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

export function getTopicTrackLabel(slug: string) {
  return TOPIC_TRACK_LABELS[slug] ?? DEFAULT_TRACK_LABEL;
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
      };
    case "in-progress":
      return {
        label: "Đang học",
      };
    case "new":
      return {
        label: "Mới mở",
      };
    default:
      return {
        label: "Chưa bắt đầu",
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
