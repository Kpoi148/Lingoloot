// Loading placeholder shown while the topics page fetches learner content.
export default function TopicsLoading() {
  const skeletonCards = Array.from({ length: 4 });
  const stats = Array.from({ length: 3 });

  return (
    <main className="min-h-screen px-4 pb-16 pt-8 text-content sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-[36px] border border-black/[0.08] bg-white/78 px-6 py-7 shadow-[0_40px_120px_-56px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_40px_120px_-56px_rgba(2,6,23,0.9)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="space-y-6">
            <div className="max-w-5xl space-y-6">
              <div className="h-9 w-40 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/80" />
              <div className="space-y-3">
                <div className="h-14 w-full max-w-2xl animate-pulse rounded-[28px] bg-slate-200/70 dark:bg-slate-800/80" />
                <div className="h-5 w-full max-w-2xl animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/70" />
                <div className="h-5 w-3/5 max-w-xl animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/70" />
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="h-11 w-44 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/80" />
                <div className="h-11 w-36 animate-pulse rounded-full bg-slate-200/60 dark:bg-slate-800/70" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((_, index) => (
                  <div
                    key={`stat-${index}`}
                    className="rounded-[24px] border border-black/[0.06] bg-white/72 p-4 dark:border-white/10 dark:bg-white/[0.05]"
                  >
                    <div className="h-11 w-11 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/80" />
                    <div className="mt-4 h-8 w-16 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/80" />
                    <div className="mt-2 h-4 w-28 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/70" />
                    <div className="mt-2 h-4 w-32 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/70" />
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-4xl rounded-[30px] border border-black/[0.08] bg-white/80 p-6 dark:border-white/10 dark:bg-slate-950/80">
              <div className="h-4 w-24 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/70" />
              <div className="mt-4 h-10 w-3/4 animate-pulse rounded-[24px] bg-slate-200/70 dark:bg-slate-800/80" />
              <div className="mt-4 h-4 w-full animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/70" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/70" />
              <div className="mt-6 flex flex-wrap gap-2">
                <div className="h-8 w-28 animate-pulse rounded-full bg-slate-200/60 dark:bg-slate-800/70" />
                <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200/60 dark:bg-slate-800/70" />
                <div className="h-8 w-32 animate-pulse rounded-full bg-slate-200/60 dark:bg-slate-800/70" />
              </div>
              <div className="mt-6 h-3 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/80" />
              <div className="mt-6 flex gap-3">
                <div className="h-10 w-40 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/80" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-[28px] border border-black/[0.08] bg-white/75 p-4 dark:border-white/10 dark:bg-slate-950/72 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="h-12 w-full max-w-xl animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/80" />
              <div className="h-4 w-56 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/70" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`chip-${index}`}
                  className="h-10 w-28 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/80"
                />
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {skeletonCards.map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-[290px] animate-pulse rounded-[30px] border border-black/[0.08] bg-white/78 dark:border-white/10 dark:bg-slate-950/72"
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
