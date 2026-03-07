"use client";
// Pagination controls for moving through the admin user list.

type AdminUsersPaginationProps = {
  currentPage: number;
  totalPages: number;
  canGoBack: boolean;
  canGoForward: boolean;
  onPageChange: (nextPage: number) => void;
};

export default function AdminUsersPagination({
  currentPage,
  totalPages,
  canGoBack,
  canGoForward,
  onPageChange,
}: AdminUsersPaginationProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoBack}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoForward}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
