// Loading placeholder shown while the learner practice lobby fetches active games.
export default function PracticeLoading() {
  return (
    <main className="min-h-screen px-4 pb-16 pt-8 text-content sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-[30px] border border-black/[0.08] bg-white/80 p-5 dark:border-white/10 dark:bg-slate-950/76 sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 animate-pulse rounded-[20px] bg-slate-200/70 dark:bg-slate-800/80" />
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="h-7 w-28 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/80" />
                  <div className="h-7 w-28 animate-pulse rounded-full bg-slate-200/60 dark:bg-slate-800/70" />
                </div>
                <div className="h-11 w-72 animate-pulse rounded-[24px] bg-slate-200/70 dark:bg-slate-800/80" />
                <div className="h-4 w-full max-w-2xl animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/70" />
                <div className="h-4 w-4/5 max-w-xl animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/70" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`practice-stat-${index}`}
                  className="rounded-[22px] border border-black/[0.06] bg-white/82 px-4 py-3 dark:border-white/10 dark:bg-white/[0.05]"
                >
                  <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/80" />
                  <div className="mt-3 h-7 w-16 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/80" />
                  <div className="mt-2 h-3 w-24 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/70" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-black/[0.08] bg-white/78 p-4 dark:border-white/10 dark:bg-slate-950/74 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="h-12 w-full max-w-xl animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/80" />
            <div className="h-4 w-40 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/70" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`practice-topic-${index}`}
                className="h-10 w-28 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/80"
              />
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`practice-card-${index}`}
              className="h-[360px] animate-pulse rounded-[30px] border border-black/[0.08] bg-white/80 dark:border-white/10 dark:bg-slate-950/74"
            />
          ))}
        </section>
      </div>
    </main>
  );
}
