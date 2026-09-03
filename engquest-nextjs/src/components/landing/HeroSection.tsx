"use client";
// Editorial Hero block that communicates the product vision and invites learners to start or play.

import { ArrowRight, Play } from "lucide-react";
import {
  landingActions,
  landingHeroHighlights,
} from "@/components/landing/content";

type HeroSectionProps = {
  onNavigate: (id: string) => void;
  onOpenAuth?: (tab: "login" | "register") => void;
};

export default function HeroSection({ onNavigate, onOpenAuth }: HeroSectionProps) {
  const handleStart = () => {
    if (onOpenAuth) {
      onOpenAuth("register");
    } else {
      onNavigate(landingActions.primary.id);
    }
  };

  return (
    <section id="hero" className="relative pt-6 pb-8 space-y-8 scroll-mt-32">
      {/* Editorial Kicker */}
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
        CHƯƠNG 01 &mdash; NỀN TẢNG TIẾNG ANH GAMIFIED
      </p>

      {/* Main Headline */}
      <div className="space-y-4 max-w-4xl">
        <h1 className="font-[var(--font-display)] text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-6xl sm:leading-[1.1]">
          Chinh phục từ vựng. <br className="hidden sm:inline" />
          Thu thập{" "}
          <span className="relative inline-block text-amber-500 underline decoration-amber-500/40 underline-offset-8">
            chiến lợi phẩm.
          </span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
          Biến mỗi từ vựng tiếng Anh thành một bước thăng hạng. Rèn luyện phản xạ với Flashcard 3D, giải mã ngữ cảnh Story Cloze và sở hữu những khung Avatar hoạt họa độc nhất.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleStart}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:shadow-white/10 dark:hover:bg-slate-100"
        >
          <span>{landingActions.primary.label}</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate("interactive-demo")}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/20 dark:hover:text-white"
        >
          <Play className="h-4 w-4 fill-current text-amber-500" />
          <span>{landingActions.tertiary.label}</span>
        </button>
      </div>

      {/* Hero Signal Badges */}
      <div className="grid grid-cols-1 gap-4 pt-8 border-t border-slate-200/80 sm:grid-cols-3 dark:border-white/10">
        {landingHeroHighlights.map((signal) => (
          <div key={signal.label} className="rounded-xl border border-slate-100 bg-white/50 p-3.5 dark:border-white/5 dark:bg-slate-900/40">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {signal.label}
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
              {signal.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
