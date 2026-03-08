"use client";

// Completion modal shown after the player fills every gap correctly.
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

type CompletionModalProps = {
  isOpen: boolean;
  score: number;
  totalGaps: number;
  onReset: () => void;
};

export default function CompletionModal({
  isOpen,
  score,
  totalGaps,
  onReset,
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
            className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
              Victory
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Hoàn thành!
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Bạn đạt {score}/{totalGaps} điểm.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={onReset}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20"
              >
                Chơi lại
              </button>
              <Link
                href="/topics"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Thoát
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
