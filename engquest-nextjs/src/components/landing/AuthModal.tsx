"use client";
// Accessible, animated dialog modal for logging in or signing up without cluttering the Hero layout.

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";
import AuthTabs, { type AuthTab } from "@/components/auth/AuthTabs";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: AuthTab;
};

export default function AuthModal({
  isOpen,
  onClose,
  initialTab = "login",
}: AuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="auth-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop overlay */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            className="relative w-full max-w-md sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white/98 p-5 shadow-2xl shadow-slate-950/60 backdrop-blur-2xl dark:border-white/15 dark:bg-slate-900/98 sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-black/5 text-slate-500 transition hover:bg-black/10 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Compact Header info */}
            <div className="mb-3.5 pr-8 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-slate-100 dark:border-white/10 dark:bg-white/5 shrink-0">
                <BrandLogo className="h-6 w-6 rounded-lg overflow-hidden" size={24} />
              </span>
              <div>
                <h3 className="font-[var(--font-display)] text-base sm:text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                  Tài khoản LingoLoot
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Lưu trữ tiến độ, chuỗi streak và vật phẩm
                </p>
              </div>
            </div>

            {/* AuthTabs form */}
            <AuthTabs activeTab={initialTab} defaultTab={initialTab} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
