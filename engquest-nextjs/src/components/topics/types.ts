export type TopicRecord = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  count: number;
  progress: number;
  lastContentUpdatedAt?: string | null;
};

export type TopicFilterId = "all" | "in-progress" | "completed" | "new";

export type TopicStatus = "not-started" | "new" | "in-progress" | "completed";

export type TopicSummary = {
  totalTopics: number;
  completedTopics: number;
  activeTopics: number;
  totalWords: number;
  freshTopics: number;
  averageProgress: number;
};

export type TopicFilterOption = {
  id: TopicFilterId;
  label: string;
  hint: string;
  count: number;
};

export type TopicAction = {
  label: string;
  href: string;
};
