// Loading placeholder shown while the learner profile page resolves data.
const SkeletonBlock = ({ className }: { className: string }) => (
  <div
    className={`animate-pulse rounded-[24px] bg-slate-200/80 dark:bg-slate-800/80 ${className}`}
  />
);

export default function ProfileLoading() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-page px-4 py-10 text-content">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_30%)]" />

      <div className="relative mx-auto w-full max-w-5xl">
        <section className="rounded-[32px] border border-slate-900/10 bg-white/82 p-6 shadow-[0_35px_120px_-64px_rgba(15,23,42,0.55)] backdrop-blur dark:border-white/10 dark:bg-slate-950/82 md:p-8">
          <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-5">
              <div className="rounded-[28px] bg-white/70 p-5 dark:bg-slate-950/60">
                <SkeletonBlock className="mx-auto h-36 w-36 rounded-[32px]" />
                <div className="mt-5 flex flex-col items-center gap-3">
                  <SkeletonBlock className="h-3 w-20" />
                  <SkeletonBlock className="h-8 w-40" />
                  <SkeletonBlock className="h-4 w-48" />
                  <div className="flex gap-2">
                    <SkeletonBlock className="h-8 w-16" />
                    <SkeletonBlock className="h-8 w-24" />
                  </div>
                </div>
              </div>

              <SkeletonBlock className="h-40 w-full" />
              <SkeletonBlock className="h-52 w-full" />
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <SkeletonBlock className="h-3 w-28" />
                <SkeletonBlock className="h-10 w-72" />
                <SkeletonBlock className="h-4 w-full max-w-2xl" />
              </div>

              <SkeletonBlock className="h-32 w-full" />

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock
                    key={`profile-stat-${index}`}
                    className="h-32 w-full"
                  />
                ))}
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <SkeletonBlock className="h-20 w-full" />
                <SkeletonBlock className="h-20 w-full" />
              </div>

              <SkeletonBlock className="h-40 w-full" />

              <div className="flex justify-between gap-3">
                <SkeletonBlock className="h-10 w-32" />
                <div className="flex gap-3">
                  <SkeletonBlock className="h-10 w-28" />
                  <SkeletonBlock className="h-10 w-32" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
