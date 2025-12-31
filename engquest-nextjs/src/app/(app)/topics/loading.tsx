export default function TopicsLoading() {
  const skeletonCards = Array.from({ length: 6 });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 shadow-sm">
            LingoLoot
          </span>
          <div className="space-y-3">
            <div className="h-9 w-72 animate-pulse rounded-2xl bg-slate-200/70" />
            <div className="h-4 w-full max-w-2xl animate-pulse rounded-2xl bg-slate-200/60" />
            <div className="h-4 w-3/4 max-w-xl animate-pulse rounded-2xl bg-slate-200/60" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {skeletonCards.map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-48 animate-pulse rounded-3xl border border-slate-200/70 bg-white/70"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
