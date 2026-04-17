import {
  Activity,
  BarChart3,
  BookOpen,
  FileQuestion,
  Layers3,
  type LucideIcon,
  Users,
} from "lucide-react";
import { cn } from "@/lib/shared/utils";

type OverviewData = {
  vocabularyCount: number;
  categoryCount: number;
  quizCount: number;
  userCount: number;
};

type DashboardTrendPoint = {
  label: string;
  monthKey: string;
  vocabularyCount: number;
  quizCount: number;
  userCount: number;
};

type DashboardCategoryDistribution = {
  id: string;
  name: string;
  vocabularyCount: number;
  share: number;
};

type DashboardProgress = {
  trackedTopics: number;
  vocabCompleted: number;
  quizCompleted: number;
  fullyCompleted: number;
  activeLearnerCount: number;
  learnerCount: number;
};

type DashboardAnalytics = {
  trends: DashboardTrendPoint[];
  categoryDistribution: DashboardCategoryDistribution[];
  progress: DashboardProgress;
};

type AdminDashboardInsightsProps = {
  overviewData: OverviewData | null;
  analyticsData: DashboardAnalytics | null;
};

type TrendMetric = {
  label: string;
  helper: string;
  total: number;
  currentMonth: number;
  icon: LucideIcon;
  lineColor: string;
  gradientFrom: string;
  gradientTo: string;
  series: number[];
};

type ProgressMetric = {
  label: string;
  value: number;
  ratio: number;
  tone: string;
};

const numberFormatter = new Intl.NumberFormat("vi-VN");

const barTones = [
  "from-cyan-400 via-sky-500 to-indigo-500",
  "from-violet-400 via-fuchsia-500 to-pink-500",
  "from-emerald-400 via-teal-500 to-cyan-500",
  "from-amber-400 via-orange-500 to-rose-500",
  "from-indigo-400 via-blue-500 to-cyan-500",
  "from-fuchsia-400 via-rose-500 to-orange-500",
];

function formatNumber(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "--";
  }

  return numberFormatter.format(value);
}

function formatRatio(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function buildSparkline(values: number[]) {
  const width = 240;
  const height = 64;
  const inset = 4;
  const drawableHeight = height - inset * 2;
  const step = values.length > 1 ? (width - inset * 2) / (values.length - 1) : 0;
  const maxValue = Math.max(...values, 1);
  const baseline = height - inset;

  const points = values.map((value, index) => {
    const x = inset + index * step;
    const y = baseline - (value / maxValue) * drawableHeight;
    return { x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = points.length
    ? `M ${points[0].x} ${baseline} ${points
        .map((point) => `L ${point.x} ${point.y}`)
        .join(" ")} L ${points.at(-1)?.x ?? inset} ${baseline} Z`
    : "";

  return { linePath, areaPath };
}

function createGradientId(label: string) {
  return `dashboard-trend-${label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")}`;
}

function Sparkline({
  values,
  lineColor,
  gradientFrom,
  gradientTo,
  gradientId,
}: {
  values: number[];
  lineColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientId: string;
}) {
  const { linePath, areaPath } = buildSparkline(values);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 64"
      className="h-16 w-full overflow-visible"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor={gradientFrom} stopOpacity="0.28" />
          <stop offset="100%" stopColor={gradientTo} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <path
        d="M 4 60 H 236"
        className="stroke-slate-200/80 dark:stroke-slate-800/80"
        strokeDasharray="5 6"
        strokeLinecap="round"
        strokeWidth="1"
        fill="none"
      />

      {areaPath ? <path d={areaPath} fill={`url(#${gradientId})`} /> : null}
      {linePath ? (
        <path
          d={linePath}
          stroke={lineColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          fill="none"
        />
      ) : null}
    </svg>
  );
}

function TrendPanel({
  overviewData,
  trends,
}: {
  overviewData: OverviewData | null;
  trends: DashboardTrendPoint[];
}) {
  const firstLabel = trends[0]?.label ?? "--";
  const lastLabel = trends.at(-1)?.label ?? "--";

  const metrics: TrendMetric[] = [
    {
      label: "Từ vựng",
      helper: "Theo số bản ghi mới được thêm vào hệ thống.",
      total: overviewData?.vocabularyCount ?? 0,
      currentMonth: trends.at(-1)?.vocabularyCount ?? 0,
      icon: BookOpen,
      lineColor: "#38bdf8",
      gradientFrom: "#38bdf8",
      gradientTo: "#0f172a",
      series: trends.map((item) => item.vocabularyCount),
    },
    {
      label: "Quiz",
      helper: "Theo số bộ câu hỏi mới được tạo theo tháng.",
      total: overviewData?.quizCount ?? 0,
      currentMonth: trends.at(-1)?.quizCount ?? 0,
      icon: FileQuestion,
      lineColor: "#f97316",
      gradientFrom: "#fb923c",
      gradientTo: "#7c2d12",
      series: trends.map((item) => item.quizCount),
    },
    {
      label: "Người dùng",
      helper: "Theo số tài khoản học viên mới tham gia.",
      total: overviewData?.userCount ?? 0,
      currentMonth: trends.at(-1)?.userCount ?? 0,
      icon: Users,
      lineColor: "#34d399",
      gradientFrom: "#34d399",
      gradientTo: "#064e3b",
      series: trends.map((item) => item.userCount),
    },
  ];

  return (
    <section className="landing-panel animate-reveal rounded-[28px] p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Xu hướng gần đây
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
            Nhịp tăng trưởng 6 tháng
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Theo dõi tốc độ thêm nội dung và số học viên mới để phát hiện giai đoạn hệ thống đang tăng nhanh hoặc chững lại.
          </p>
        </div>

        <div className="hidden rounded-2xl bg-white/65 p-3 text-slate-500 shadow-sm dark:bg-slate-950/45 dark:text-slate-300 sm:flex">
          <BarChart3 className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="grid gap-4 rounded-[24px] bg-white/65 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur dark:bg-slate-950/40 dark:ring-white/5 lg:grid-cols-[220px_minmax(0,1fr)]"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-slate-900/90 p-3 text-white shadow-lg shadow-slate-900/10 dark:bg-white/10">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                    {formatNumber(metric.currentMonth)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Tháng hiện tại
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Sparkline
                  values={metric.series}
                  lineColor={metric.lineColor}
                  gradientFrom={metric.gradientFrom}
                  gradientTo={metric.gradientTo}
                  gradientId={createGradientId(metric.label)}
                />

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <p>{metric.helper}</p>
                  <p className="rounded-full bg-slate-900/5 px-3 py-1 font-medium text-slate-600 dark:bg-white/5 dark:text-slate-300">
                    {formatNumber(metric.total)} tổng
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/50 pt-4 text-xs uppercase tracking-[0.22em] text-slate-400 dark:border-white/5 dark:text-slate-500">
        <span>Khoảng thời gian</span>
        <span>
          {firstLabel} → {lastLabel}
        </span>
      </div>
    </section>
  );
}

function CategoryDistributionPanel({
  categories,
  totalVocabulary,
}: {
  categories: DashboardCategoryDistribution[];
  totalVocabulary: number;
}) {
  return (
    <section className="landing-panel animate-reveal rounded-[28px] p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Phân bổ nội dung
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
            Từ vựng theo chủ đề
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Nhìn nhanh chủ đề nào đang chiếm phần lớn kho nội dung để cân bằng lại độ phủ.
          </p>
        </div>

        <div className="hidden rounded-2xl bg-white/65 p-3 text-slate-500 shadow-sm dark:bg-slate-950/45 dark:text-slate-300 sm:flex">
          <Layers3 className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {categories.length ? (
          categories.map((category, index) => {
            const share = Math.round(category.share * 100);

            return (
              <article
                key={category.id}
                className="rounded-[24px] bg-white/65 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur dark:bg-slate-950/40 dark:ring-white/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {category.name}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                      {share}% tổng kho từ vựng
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {formatNumber(category.vocabularyCount)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">từ vựng</p>
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/70">
                  <div
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r transition-[width] duration-500",
                      barTones[index % barTones.length]
                    )}
                    style={{ width: `${Math.max(share, category.vocabularyCount > 0 ? 10 : 0)}%` }}
                  />
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-[24px] bg-white/65 p-5 text-sm text-slate-500 shadow-sm ring-1 ring-white/60 backdrop-blur dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/5">
            Chưa có đủ dữ liệu chủ đề để hiển thị phân bổ nội dung.
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/50 pt-4 text-sm text-slate-500 dark:border-white/5 dark:text-slate-400">
        <span>Tổng từ vựng đang theo dõi</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {formatNumber(totalVocabulary)}
        </span>
      </div>
    </section>
  );
}

function ProgressPanel({ progress }: { progress: DashboardProgress }) {
  const activeRatio = formatRatio(
    progress.activeLearnerCount,
    progress.learnerCount
  );
  const trackedTopics = progress.trackedTopics;

  const progressMetrics: ProgressMetric[] = [
    {
      label: "Hoàn thành phần từ vựng",
      value: progress.vocabCompleted,
      ratio: formatRatio(progress.vocabCompleted, trackedTopics),
      tone: "from-cyan-400 to-sky-500",
    },
    {
      label: "Hoàn thành phần quiz",
      value: progress.quizCompleted,
      ratio: formatRatio(progress.quizCompleted, trackedTopics),
      tone: "from-violet-400 to-fuchsia-500",
    },
    {
      label: "Hoàn tất cả chủ đề",
      value: progress.fullyCompleted,
      ratio: formatRatio(progress.fullyCompleted, trackedTopics),
      tone: "from-emerald-400 to-teal-500",
    },
  ];

  return (
    <section className="landing-panel animate-reveal rounded-[28px] p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Mức độ sử dụng
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
            Tiến độ và độ hoạt động
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Đo số người học còn quay lại và tỷ lệ hoàn thành từng mốc trong hành trình học.
          </p>
        </div>

        <div className="hidden rounded-2xl bg-white/65 p-3 text-slate-500 shadow-sm dark:bg-slate-950/45 dark:text-slate-300 sm:flex">
          <Activity className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-5 text-white shadow-xl shadow-slate-900/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Người học hoạt động 30 ngày
            </p>
            <p className="mt-3 text-4xl font-semibold">{activeRatio}%</p>
            <p className="mt-2 text-sm text-slate-300">
              {formatNumber(progress.activeLearnerCount)} / {formatNumber(progress.learnerCount)} tài khoản học tập có đăng nhập gần đây.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-3 text-slate-100">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {progressMetrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[24px] bg-white/65 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur dark:bg-slate-950/40 dark:ring-white/5"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {metric.label}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  {trackedTopics > 0
                    ? `${metric.ratio}% trên ${formatNumber(trackedTopics)} lượt theo dõi`
                    : "Chưa có dữ liệu tiến độ"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {formatNumber(metric.value)}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">lượt hoàn tất</p>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/70">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r", metric.tone)}
                style={{ width: `${metric.ratio}%` }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function AdminDashboardInsights({
  overviewData,
  analyticsData,
}: AdminDashboardInsightsProps) {
  const trends = analyticsData?.trends ?? [];
  const categories = analyticsData?.categoryDistribution ?? [];
  const progress = analyticsData?.progress ?? {
    trackedTopics: 0,
    vocabCompleted: 0,
    quizCompleted: 0,
    fullyCompleted: 0,
    activeLearnerCount: 0,
    learnerCount: 0,
  };
  const totalVocabulary = categories.reduce(
    (sum, category) => sum + category.vocabularyCount,
    0
  );

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Phân tích vận hành
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Bổ sung thêm góc nhìn về xu hướng, độ phủ nội dung và mức sử dụng thực tế.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
        <TrendPanel overviewData={overviewData} trends={trends} />

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
          <CategoryDistributionPanel
            categories={categories}
            totalVocabulary={overviewData?.vocabularyCount ?? totalVocabulary}
          />
          <ProgressPanel progress={progress} />
        </div>
      </div>
    </section>
  );
}
