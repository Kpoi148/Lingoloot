const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-2xl bg-surface-muted ${className}`} />
);

export default function ProfileLoading() {
  return (
    <main className="min-h-screen bg-surface-page px-4 py-10 text-content">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
        <section className="w-full rounded-3xl border border-edge bg-surface-card p-6 shadow-lg shadow-shadow-theme lg:w-[38%]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <SkeletonBlock className="h-3 w-32" />
              <SkeletonBlock className="h-7 w-48" />
              <SkeletonBlock className="h-4 w-56" />
            </div>
            <SkeletonBlock className="h-9 w-28" />
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <SkeletonBlock className="h-20 w-20 rounded-full" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-40" />
                <SkeletonBlock className="h-4 w-56" />
              </div>
            </div>
            <SkeletonBlock className="h-20 w-full" />
            <SkeletonBlock className="h-10 w-32" />
          </div>
        </section>

        <section className="flex w-full flex-1 flex-col rounded-3xl border border-edge bg-surface-card p-6 shadow-lg shadow-shadow-theme">
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-40" />
            <SkeletonBlock className="h-7 w-52" />
            <SkeletonBlock className="h-4 w-64" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`stat-skeleton-${index}`}
                className="rounded-2xl border border-edge bg-surface-card p-5 shadow-sm"
              >
                <SkeletonBlock className="h-10 w-10 rounded-2xl" />
                <SkeletonBlock className="mt-4 h-6 w-24" />
                <SkeletonBlock className="mt-2 h-4 w-32" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
