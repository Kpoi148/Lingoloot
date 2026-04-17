"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarClock,
  FileQuestion,
  Minus,
  TrendingUp,
  type LucideIcon,
  Users,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/shared/utils";

type OverviewData = {
  vocabularyCount: number;
  categoryCount: number;
  quizCount: number;
  userCount: number;
};

type DashboardTimelinePoint = {
  dateKey: string;
  vocabularyCount: number;
  quizCount: number;
  userCount: number;
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
  timeline: DashboardTimelinePoint[];
  progress: DashboardProgress;
};

type AdminDashboardInsightsProps = {
  overviewData: OverviewData | null;
  analyticsData: DashboardAnalytics | null;
};

type ProgressMetric = {
  label: string;
  value: number;
  ratio: number;
  tone: string;
};

type TrendRange = "30d" | "90d" | "6m" | "12m";
type TrendMetricKey = "vocabularyCount" | "quizCount" | "userCount";

type AggregatedTrendPoint = {
  bucketKey: string;
  label: string;
  fullLabel: string;
  vocabularyCount: number;
  quizCount: number;
  userCount: number;
};

type TrendChartPoint = {
  bucketKey: string;
  label: string;
  fullLabel: string;
  value: number;
};

type TrendMetricSummary = {
  key: TrendMetricKey;
  label: string;
  helper: string;
  overviewTotal: number;
  currentTotal: number;
  previousTotal: number;
  deltaPercent: number | null;
  deltaLabel: string;
  deltaTone: string;
  icon: LucideIcon;
};

type RechartsTooltipPayload = {
  value?: number | string;
  payload: TrendChartPoint;
};

const numberFormatter = new Intl.NumberFormat("vi-VN");
const compactNumberFormatter = new Intl.NumberFormat("vi-VN", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const shortDateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const fullDateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const monthShortFormatter = new Intl.DateTimeFormat("vi-VN", {
  month: "short",
  timeZone: "UTC",
});
const monthLongFormatter = new Intl.DateTimeFormat("vi-VN", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const TREND_RANGE_META: Record<
  TrendRange,
  {
    label: string;
    days: number;
    granularity: "daily" | "monthly";
    periodLabel: string;
    comparisonLabel: string;
  }
> = {
  "30d": {
    label: "30D",
    days: 30,
    granularity: "daily",
    periodLabel: "30 ngày gần nhất",
    comparisonLabel: "30 ngày trước",
  },
  "90d": {
    label: "90D",
    days: 90,
    granularity: "daily",
    periodLabel: "90 ngày gần nhất",
    comparisonLabel: "90 ngày trước",
  },
  "6m": {
    label: "6M",
    days: 183,
    granularity: "monthly",
    periodLabel: "6 tháng gần nhất",
    comparisonLabel: "6 tháng trước",
  },
  "12m": {
    label: "12M",
    days: 365,
    granularity: "monthly",
    periodLabel: "12 tháng gần nhất",
    comparisonLabel: "12 tháng trước",
  },
};

const TREND_METRIC_META: Record<
  TrendMetricKey,
  {
    label: string;
    helper: string;
    icon: LucideIcon;
    overviewKey: keyof OverviewData;
    color: string;
    areaFrom: string;
    areaTo: string;
  }
> = {
  vocabularyCount: {
    label: "Từ vựng",
    helper: "Số bản ghi mới được thêm vào hệ thống.",
    icon: BookOpen,
    overviewKey: "vocabularyCount",
    color: "#38bdf8",
    areaFrom: "rgba(56, 189, 248, 0.32)",
    areaTo: "rgba(56, 189, 248, 0.04)",
  },
  quizCount: {
    label: "Quiz",
    helper: "Số bộ câu hỏi mới được tạo theo giai đoạn.",
    icon: FileQuestion,
    overviewKey: "quizCount",
    color: "#fb923c",
    areaFrom: "rgba(251, 146, 60, 0.3)",
    areaTo: "rgba(251, 146, 60, 0.04)",
  },
  userCount: {
    label: "Người dùng",
    helper: "Số tài khoản học viên mới tham gia.",
    icon: Users,
    overviewKey: "userCount",
    color: "#34d399",
    areaFrom: "rgba(52, 211, 153, 0.32)",
    areaTo: "rgba(52, 211, 153, 0.04)",
  },
};

function formatNumber(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "--";
  }

  return numberFormatter.format(value);
}

function formatCompactNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  return compactNumberFormatter.format(value);
}

function formatRatio(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function parseDateKey(dateKey: string) {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

function formatPeriodCaption(points: DashboardTimelinePoint[]) {
  const firstPoint = points[0];
  const lastPoint = points.at(-1);

  if (!firstPoint || !lastPoint) {
    return "--";
  }

  return `${shortDateFormatter.format(
    parseDateKey(firstPoint.dateKey)
  )} → ${shortDateFormatter.format(parseDateKey(lastPoint.dateKey))}`;
}

function formatDailyAxisLabel(dateKey: string) {
  const date = parseDateKey(dateKey);
  return `${date.getUTCDate()}/${date.getUTCMonth() + 1}`;
}

function formatMonthlyAxisLabel(dateKey: string) {
  return monthShortFormatter.format(parseDateKey(dateKey)).replace(".", "");
}

function formatDailyTooltipLabel(dateKey: string) {
  return fullDateFormatter.format(parseDateKey(dateKey));
}

function formatMonthlyTooltipLabel(dateKey: string) {
  return monthLongFormatter.format(parseDateKey(dateKey));
}

function calculateDeltaPercent(currentValue: number, previousValue: number) {
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : null;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

function formatDeltaLabel(deltaPercent: number | null) {
  if (deltaPercent === null) {
    return "Mới";
  }

  if (deltaPercent === 0) {
    return "0%";
  }

  const sign = deltaPercent > 0 ? "+" : "";
  return `${sign}${deltaPercent.toFixed(1)}%`;
}

function getDeltaTone(deltaPercent: number | null) {
  if (deltaPercent === null) {
    return "bg-cyan-500/12 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300";
  }

  if (deltaPercent > 0) {
    return "bg-emerald-500/12 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300";
  }

  if (deltaPercent < 0) {
    return "bg-amber-500/12 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300";
  }

  return "bg-slate-900/6 text-slate-500 dark:bg-white/8 dark:text-slate-300";
}

function sumMetric(points: DashboardTimelinePoint[], metricKey: TrendMetricKey) {
  return points.reduce((total, point) => total + point[metricKey], 0);
}

function aggregateTimeline(
  points: DashboardTimelinePoint[],
  range: TrendRange
): AggregatedTrendPoint[] {
  if (TREND_RANGE_META[range].granularity === "daily") {
    return points.map((point) => ({
      bucketKey: point.dateKey,
      label: formatDailyAxisLabel(point.dateKey),
      fullLabel: formatDailyTooltipLabel(point.dateKey),
      vocabularyCount: point.vocabularyCount,
      quizCount: point.quizCount,
      userCount: point.userCount,
    }));
  }

  const monthlyBuckets = new Map<string, AggregatedTrendPoint>();

  for (const point of points) {
    const monthKey = point.dateKey.slice(0, 7);
    const bucketDateKey = `${monthKey}-01`;
    const existingBucket = monthlyBuckets.get(monthKey);

    if (existingBucket) {
      existingBucket.vocabularyCount += point.vocabularyCount;
      existingBucket.quizCount += point.quizCount;
      existingBucket.userCount += point.userCount;
      continue;
    }

    monthlyBuckets.set(monthKey, {
      bucketKey: monthKey,
      label: formatMonthlyAxisLabel(bucketDateKey),
      fullLabel: formatMonthlyTooltipLabel(bucketDateKey),
      vocabularyCount: point.vocabularyCount,
      quizCount: point.quizCount,
      userCount: point.userCount,
    });
  }

  return Array.from(monthlyBuckets.values());
}

function findPeakPoint(
  points: AggregatedTrendPoint[],
  metricKey: TrendMetricKey
) {
  return points.reduce<AggregatedTrendPoint | null>((peakPoint, point) => {
    if (!peakPoint || point[metricKey] > peakPoint[metricKey]) {
      return point;
    }

    return peakPoint;
  }, null);
}

function getTrendMetricSummaries(
  currentPeriod: DashboardTimelinePoint[],
  previousPeriod: DashboardTimelinePoint[],
  overviewData: OverviewData | null
): TrendMetricSummary[] {
  return (Object.entries(TREND_METRIC_META) as Array<
    [TrendMetricKey, (typeof TREND_METRIC_META)[TrendMetricKey]]
  >).map(([metricKey, metricMeta]) => {
    const currentTotal = sumMetric(currentPeriod, metricKey);
    const previousTotal = sumMetric(previousPeriod, metricKey);
    const deltaPercent = calculateDeltaPercent(currentTotal, previousTotal);

    return {
      key: metricKey,
      label: metricMeta.label,
      helper: metricMeta.helper,
      overviewTotal: overviewData?.[metricMeta.overviewKey] ?? 0,
      currentTotal,
      previousTotal,
      deltaPercent,
      deltaLabel: formatDeltaLabel(deltaPercent),
      deltaTone: getDeltaTone(deltaPercent),
      icon: metricMeta.icon,
    };
  });
}

function TrendTooltipCard({
  active,
  payload,
  metricLabel,
  metricColor,
}: {
  active?: boolean;
  payload?: RechartsTooltipPayload[];
  metricLabel: string;
  metricColor: string;
}) {
  const point = payload?.[0];

  if (!active || !point?.payload) {
    return null;
  }

  const value =
    typeof point.value === "number" ? point.value : Number(point.value ?? 0);

  return (
    <div className="rounded-[18px] border border-slate-200/70 bg-white/95 px-3 py-2.5 shadow-xl shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-slate-950/90 dark:shadow-slate-950/30">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {point.payload.fullLabel}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: metricColor }}
        />
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {metricLabel}
        </span>
        <span className="ml-auto text-sm font-semibold text-slate-900 dark:text-slate-100">
          {formatNumber(value)}
        </span>
      </div>
    </div>
  );
}

function TrendPanel({
  overviewData,
  timeline,
}: {
  overviewData: OverviewData | null;
  timeline: DashboardTimelinePoint[];
}) {
  const [selectedMetric, setSelectedMetric] =
    useState<TrendMetricKey>("vocabularyCount");
  const [selectedRange, setSelectedRange] = useState<TrendRange>("90d");

  const rangeMeta = TREND_RANGE_META[selectedRange];
  const selectedMetricMeta = TREND_METRIC_META[selectedMetric];

  const currentPeriod = useMemo(
    () => timeline.slice(-rangeMeta.days),
    [timeline, rangeMeta.days]
  );
  const previousPeriod = useMemo(
    () =>
      timeline.slice(
        Math.max(timeline.length - rangeMeta.days * 2, 0),
        Math.max(timeline.length - rangeMeta.days, 0)
      ),
    [timeline, rangeMeta.days]
  );
  const metricSummaries = useMemo(
    () => getTrendMetricSummaries(currentPeriod, previousPeriod, overviewData),
    [currentPeriod, previousPeriod, overviewData]
  );
  const aggregatedPoints = useMemo(
    () => aggregateTimeline(currentPeriod, selectedRange),
    [currentPeriod, selectedRange]
  );
  const chartData = useMemo<TrendChartPoint[]>(
    () =>
      aggregatedPoints.map((point) => ({
        bucketKey: point.bucketKey,
        label: point.label,
        fullLabel: point.fullLabel,
        value: point[selectedMetric],
      })),
    [aggregatedPoints, selectedMetric]
  );
  const axisLabelLookup = useMemo(
    () => new Map(chartData.map((point) => [point.bucketKey, point.label])),
    [chartData]
  );
  const selectedSummary =
    metricSummaries.find((summary) => summary.key === selectedMetric) ??
    metricSummaries[0];
  const SelectedMetricIcon = selectedMetricMeta.icon;
  const peakPoint = useMemo(
    () => findPeakPoint(aggregatedPoints, selectedMetric),
    [aggregatedPoints, selectedMetric]
  );
  const latestPoint = aggregatedPoints.at(-1) ?? null;
  const averagePerBucket =
    aggregatedPoints.length > 0
      ? Math.round(selectedSummary.currentTotal / aggregatedPoints.length)
      : 0;
  const chartConfig = useMemo(
    () =>
      ({
        value: {
          label: selectedMetricMeta.label,
          color: selectedMetricMeta.color,
        },
      }) satisfies ChartConfig,
    [selectedMetricMeta.label, selectedMetricMeta.color]
  );

  return (
    <section className="landing-panel animate-reveal rounded-[28px] p-6 sm:p-7">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Xu hướng gần đây
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
            Nhịp tăng trưởng linh hoạt
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Chuyển nhanh theo giai đoạn để xem hệ thống đang tăng nội dung hay
            người dùng ở nhịp nào, kèm so sánh với kỳ trước và tooltip chi tiết
            trên chart.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="landing-subtle-panel inline-flex rounded-[20px] p-1.5">
            {(Object.entries(TREND_RANGE_META) as Array<
              [TrendRange, (typeof TREND_RANGE_META)[TrendRange]]
            >).map(([rangeValue, meta]) => (
              <button
                key={rangeValue}
                type="button"
                onClick={() => setSelectedRange(rangeValue)}
                className={cn(
                  "rounded-2xl px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition",
                  selectedRange === rangeValue
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/15 dark:bg-white dark:text-slate-900"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                )}
                aria-pressed={selectedRange === rangeValue}
              >
                {meta.label}
              </button>
            ))}
          </div>

          <div className="hidden rounded-2xl bg-white/65 p-3 text-slate-500 shadow-sm dark:bg-slate-950/45 dark:text-slate-300 sm:flex">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {metricSummaries.map((summary) => {
          const Icon = summary.icon;
          const isSelected = summary.key === selectedMetric;
          const DeltaIcon =
            summary.deltaPercent === null
              ? TrendingUp
              : summary.deltaPercent > 0
                ? ArrowUpRight
                : summary.deltaPercent < 0
                  ? ArrowDownRight
                  : Minus;

          return (
            <button
              key={summary.key}
              type="button"
              onClick={() => setSelectedMetric(summary.key)}
              className={cn(
                "rounded-[24px] p-5 text-left shadow-sm ring-1 transition",
                isSelected
                  ? "bg-slate-900 text-white ring-slate-900/80 shadow-xl shadow-slate-900/20 dark:bg-slate-100 dark:text-slate-900 dark:ring-white/20 dark:shadow-slate-950/30"
                  : "bg-white/70 text-slate-900 ring-white/60 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/5"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={cn(
                    "rounded-2xl p-3",
                    isSelected
                      ? "bg-white/12 text-white dark:bg-slate-900/8 dark:text-slate-900"
                      : "bg-slate-900/6 text-slate-700 dark:bg-white/8 dark:text-slate-100"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
                    isSelected
                      ? "bg-white/12 text-white/90 dark:bg-slate-900/10 dark:text-slate-900"
                      : summary.deltaTone
                  )}
                >
                  <DeltaIcon className="h-3.5 w-3.5" />
                  {summary.deltaLabel}
                </span>
              </div>

              <p
                className={cn(
                  "mt-5 text-xs font-semibold uppercase tracking-[0.3em]",
                  isSelected
                    ? "text-white/60 dark:text-slate-500"
                    : "text-slate-400 dark:text-slate-500"
                )}
              >
                {summary.label}
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {formatNumber(summary.currentTotal)}
              </p>
              <p
                className={cn(
                  "mt-2 text-sm leading-6",
                  isSelected
                    ? "text-white/75 dark:text-slate-600"
                    : "text-slate-500 dark:text-slate-400"
                )}
              >
                {summary.helper}
              </p>

              <div
                className={cn(
                  "mt-5 flex items-center justify-between text-xs uppercase tracking-[0.22em]",
                  isSelected
                    ? "text-white/55 dark:text-slate-500"
                    : "text-slate-400 dark:text-slate-500"
                )}
              >
                <span>{rangeMeta.periodLabel}</span>
                <span>{formatNumber(summary.overviewTotal)} tổng</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
        <div className="rounded-[26px] bg-white/68 p-5 shadow-sm ring-1 ring-white/60 backdrop-blur dark:bg-slate-950/45 dark:ring-white/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                {selectedMetricMeta.label}
              </p>
              <h4 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {rangeMeta.periodLabel}
              </h4>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {formatPeriodCaption(currentPeriod)} ·{" "}
                {rangeMeta.granularity === "daily" ? "Theo ngày" : "Theo tháng"}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-slate-300">
              <CalendarClock className="h-4 w-4" />
              So với {rangeMeta.comparisonLabel}
            </div>
          </div>

          <ChartContainer
            config={chartConfig}
            className="mt-6 h-[320px] w-full overflow-visible [&_.recharts-curve.recharts-tooltip-cursor]:stroke-slate-300 dark:[&_.recharts-curve.recharts-tooltip-cursor]:stroke-slate-700"
          >
            <AreaChart
              data={chartData}
              margin={{ top: 16, right: 10, left: 6, bottom: 6 }}
            >
              <defs>
                <linearGradient id="trend-area-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={selectedMetricMeta.areaFrom}
                    stopOpacity="1"
                  />
                  <stop
                    offset="100%"
                    stopColor={selectedMetricMeta.areaTo}
                    stopOpacity="1"
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="4 8"
                stroke="rgba(148, 163, 184, 0.24)"
              />

              <XAxis
                dataKey="bucketKey"
                axisLine={false}
                tickLine={false}
                minTickGap={24}
                tickMargin={10}
                tickFormatter={(value) =>
                  axisLabelLookup.get(String(value)) ?? String(value)
                }
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={12}
                width={48}
                tickFormatter={(value) => formatCompactNumber(Number(value))}
              />

              <ChartTooltip
                cursor={{ strokeDasharray: "4 6" }}
                content={
                  <TrendTooltipCard
                    metricLabel={selectedMetricMeta.label}
                    metricColor={selectedMetricMeta.color}
                  />
                }
              />

              <Area
                type="monotone"
                dataKey="value"
                fill="url(#trend-area-fill)"
                stroke="none"
                activeDot={false}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={selectedMetricMeta.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: selectedMetricMeta.color,
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-5 text-white shadow-xl shadow-slate-900/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  {selectedMetricMeta.label} trong kỳ
                </p>
                <p className="mt-3 text-4xl font-semibold">
                  {formatNumber(selectedSummary.currentTotal)}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {rangeMeta.periodLabel} · kỳ trước{" "}
                  {formatNumber(selectedSummary.previousTotal)}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-3 text-slate-100">
                <SelectedMetricIcon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
              {selectedSummary.deltaPercent === null ? (
                <TrendingUp className="h-4 w-4" />
              ) : selectedSummary.deltaPercent > 0 ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : selectedSummary.deltaPercent < 0 ? (
                <ArrowDownRight className="h-4 w-4" />
              ) : (
                <Minus className="h-4 w-4" />
              )}
              {selectedSummary.deltaLabel} so với {rangeMeta.comparisonLabel}
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      14,
                      formatRatio(
                        selectedSummary.currentTotal,
                        Math.max(selectedSummary.overviewTotal, 1)
                      )
                    )
                  )}%`,
                  background: `linear-gradient(90deg, ${selectedMetricMeta.color}, rgba(255,255,255,0.82))`,
                }}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            <article className="rounded-[24px] bg-white/68 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur dark:bg-slate-950/45 dark:ring-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                Mốc gần nhất
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {formatNumber(latestPoint?.[selectedMetric] ?? 0)}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {latestPoint?.fullLabel ?? "Chưa có dữ liệu"}
              </p>
            </article>

            <article className="rounded-[24px] bg-white/68 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur dark:bg-slate-950/45 dark:ring-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                Đỉnh trong kỳ
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {formatNumber(peakPoint?.[selectedMetric] ?? 0)}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {peakPoint?.fullLabel ?? "Chưa có dữ liệu"}
              </p>
            </article>

            <article className="rounded-[24px] bg-white/68 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur dark:bg-slate-950/45 dark:ring-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                Trung bình mỗi mốc
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {formatNumber(averagePerBucket)}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {rangeMeta.granularity === "daily" ? "mỗi ngày" : "mỗi tháng"}
              </p>
            </article>
          </div>
        </div>
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
  const inactiveLearnerCount = Math.max(
    progress.learnerCount - progress.activeLearnerCount,
    0
  );

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

  const summaryStats = [
    {
      label: "Chủ đề đang được theo dõi",
      value: formatNumber(trackedTopics),
      note: "bản ghi tiến độ",
    },
    {
      label: "Người học đang hoạt động",
      value: formatNumber(progress.activeLearnerCount),
      note: "30 ngày gần nhất",
    },
    {
      label: "Người học chưa quay lại",
      value: formatNumber(inactiveLearnerCount),
      note: "cần kích hoạt lại",
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
            Tập trung vào tỷ lệ quay lại và các mốc hoàn tất quan trọng để biết
            phần nào của hành trình học đang giữ chân người dùng tốt.
          </p>
        </div>

        <div className="hidden rounded-2xl bg-white/65 p-3 text-slate-500 shadow-sm dark:bg-slate-950/45 dark:text-slate-300 sm:flex">
          <Activity className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-5 text-white shadow-xl shadow-slate-900/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Người học hoạt động 30 ngày
              </p>
              <p className="mt-3 text-4xl font-semibold">{activeRatio}%</p>
              <p className="mt-2 text-sm text-slate-300">
                {formatNumber(progress.activeLearnerCount)} /{" "}
                {formatNumber(progress.learnerCount)} tài khoản học tập có đăng
                nhập gần đây.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-3 text-slate-100">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500"
              style={{ width: `${activeRatio}%` }}
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {summaryStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-300">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
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
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    lượt hoàn tất
                  </p>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/70">
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r",
                    metric.tone
                  )}
                  style={{ width: `${metric.ratio}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AdminDashboardInsights({
  overviewData,
  analyticsData,
}: AdminDashboardInsightsProps) {
  const timeline = analyticsData?.timeline ?? [];
  const progress = analyticsData?.progress ?? {
    trackedTopics: 0,
    vocabCompleted: 0,
    quizCompleted: 0,
    fullyCompleted: 0,
    activeLearnerCount: 0,
    learnerCount: 0,
  };

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Phân tích vận hành
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Bổ sung thêm góc nhìn về xu hướng tăng trưởng và mức sử dụng thực tế
          của hệ thống.
        </p>
      </div>

      <TrendPanel overviewData={overviewData} timeline={timeline} />
      <ProgressPanel progress={progress} />
    </section>
  );
}
