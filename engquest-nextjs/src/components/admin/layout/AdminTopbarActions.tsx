"use client";
// Admin topbar actions for quick navigation and utility controls.

import Link from "next/link";
import { Sparkles } from "lucide-react";

import ThemeToggle from "@/components/common/ThemeToggle";

export default function AdminTopbarActions() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      <Link
        href="/admin/ai-hub"
        className="inline-flex items-center gap-1 sm:gap-2 rounded-full border border-pink-200/70 bg-white px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-transparent shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(236,72,153,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/60 dark:border-pink-500/30 dark:bg-slate-900"
      >
        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-pink-500" />
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          AI Studio
        </span>
      </Link>

      <ThemeToggle />

      <Link
        href="/"
        className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <span className="hidden sm:inline">Về trang chủ</span>
        <span className="sm:hidden">Trang chủ</span>
      </Link>
    </div>
  );
}
