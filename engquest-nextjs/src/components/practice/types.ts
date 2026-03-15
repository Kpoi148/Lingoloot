export type PracticeGameRecord = {
  id: string;
  title: string;
  topicName: string;
  createdAt?: string | null;
  gapCount: number;
  distractorCount: number;
  estimatedMinutes: number;
  preview: string;
};

export type PracticeSummary = {
  totalGames: number;
  totalTopics: number;
  totalGaps: number;
  freshGames: number;
};

export type PracticeTopicOption = {
  id: string;
  label: string;
  count: number;
};

export type PracticeTheme = {
  glowClass: string;
  iconClass: string;
  cardBorderClass: string;
  previewClass: string;
  buttonClass: string;
  buttonGhostClass: string;
  badgeClass: string;
};
