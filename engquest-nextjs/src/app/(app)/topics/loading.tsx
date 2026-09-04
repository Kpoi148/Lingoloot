// Loading placeholder shown while the topics page fetches learner content.
export default function TopicsLoading() {
  return (
    <main className="topics-shell min-h-screen px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-14">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12">
        <section className="topics-hero" aria-label="Đang tải bản đồ học tập">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.72fr)] lg:gap-12">
            <div className="max-w-3xl">
              <div className="topics-skeleton h-4 w-48" />
              <div className="topics-skeleton mt-7 h-14 w-full max-w-2xl sm:h-20" />
              <div className="topics-skeleton mt-5 h-5 w-full max-w-xl" />
              <div className="topics-skeleton mt-3 h-5 w-4/5 max-w-lg" />
              <div className="topics-skeleton mt-6 h-4 w-52" />
            </div>

            <div className="topics-resume min-h-96">
              <div className="flex justify-between gap-4">
                <div className="topics-skeleton topics-skeleton--ink h-3 w-36" />
                <div className="topics-skeleton topics-skeleton--ink h-3 w-20" />
              </div>
              <div className="topics-skeleton topics-skeleton--ink mt-10 h-3 w-44" />
              <div className="topics-skeleton topics-skeleton--ink mt-4 h-10 w-2/3" />
              <div className="topics-skeleton topics-skeleton--ink mt-5 h-4 w-full" />
              <div className="topics-skeleton topics-skeleton--ink mt-3 h-4 w-4/5" />
              <div className="topics-skeleton topics-skeleton--ink mt-8 h-1 w-full" />
              <div className="topics-skeleton topics-skeleton--ink mt-8 h-11 w-40" />
            </div>
          </div>

          <div className="topics-summary-strip mt-10 grid sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="topics-summary-item">
                <div className="topics-skeleton h-3 w-24" />
                <div className="topics-skeleton mt-3 h-9 w-20" />
                <div className="topics-skeleton mt-2 h-4 w-36" />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="topics-catalog-heading">
            <div>
              <div className="topics-skeleton h-3 w-32" />
              <div className="topics-skeleton mt-4 h-11 w-48" />
            </div>
            <div className="w-full max-w-xl">
              <div className="topics-skeleton h-4 w-full" />
              <div className="topics-skeleton mt-3 h-4 w-3/4" />
            </div>
          </div>

          <div className="topics-toolbar" aria-hidden="true">
            <div className="topics-toolbar-main">
              <div className="topics-skeleton h-11 w-full max-w-sm" />
              <div className="flex gap-7 overflow-hidden">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="topics-skeleton h-4 w-24 shrink-0" />
                ))}
              </div>
            </div>
            <div className="topics-skeleton mt-4 h-3 w-44" />
          </div>

          <div className="topics-catalog-grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <article key={index} className="topics-card min-h-80" aria-hidden="true">
                <div className="topics-card-rail">
                  <div className="topics-skeleton h-3 w-6" />
                  <span className="topics-card-rail-line" />
                  <div className="topics-skeleton h-10 w-10" />
                </div>
                <div>
                  <div className="flex justify-between gap-5">
                    <div className="topics-skeleton h-3 w-40" />
                    <div className="topics-skeleton h-3 w-20" />
                  </div>
                  <div className="topics-skeleton mt-5 h-9 w-1/2" />
                  <div className="topics-skeleton mt-5 h-4 w-full" />
                  <div className="topics-skeleton mt-3 h-4 w-4/5" />
                  <div className="topics-skeleton mt-7 h-11 w-full" />
                  <div className="topics-skeleton mt-7 h-px w-full" />
                  <div className="topics-skeleton mt-5 h-4 w-36" />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
