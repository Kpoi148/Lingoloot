"use client";

// Completion modal shown after the player fills every gap correctly.
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

type CompletionModalProps = {
  isOpen: boolean;
  score: number;
  totalGaps: number;
  onReset: () => void;
  exitHref?: string;
  exitLabel?: string;
};

export default function CompletionModal({
  isOpen,
  score,
  totalGaps,
  onReset,
  exitHref = "/learn/practice",
  exitLabel = "Về sảnh game",
}: CompletionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-sm overflow-hidden rounded-[30px] border border-black/[0.08] bg-white p-6 text-center shadow-[0_36px_110px_-40px_rgba(15,23,42,0.55)] dark:border-white/10 dark:bg-slate-950"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-[0_18px_44px_-24px_rgba(16,185,129,0.72)]">
              <span className="text-xl font-semibold">✓</span>
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-300">
              Story clear
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
              Hoàn thành!
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Bạn đạt {score}/{totalGaps} điểm.
            </p>
            <div className="mt-5 rounded-[22px] border border-black/[0.06] bg-black/[0.03] px-4 py-3 text-left dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Kết quả
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Bạn đã điền đúng toàn bộ ô trống. Có thể chơi lại để luyện tốc
                độ hoặc quay về lobby để chọn màn khác.
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={onReset}
                className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white dark:text-slate-950"
              >
                Chơi lại
              </button>
              <Link
                href={exitHref}
                className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                {exitLabel}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
