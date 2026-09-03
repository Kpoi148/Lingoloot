"use client";
// Editorial Hero block that communicates the product vision and invites learners to start or play.

import { ArrowRight, BookOpenCheck, Compass, Play } from "lucide-react";
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
    <section id="hero" className="relative scroll-mt-32 overflow-hidden pb-16 pt-10 sm:pb-20 lg:pt-14">
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.72fr)] lg:gap-16">
          <div className="animate-fade-in-up">
            <p className="landing-label landing-kicker">
              CHƯƠNG 01 &mdash; NỀN TẢNG TIẾNG ANH GAMIFIED
            </p>

            <h1 className="landing-hero-title mt-8 max-w-4xl font-[var(--font-display)] font-extrabold">
              Chinh phục từ vựng.
              <span className="mt-2 block">
                Thu thập <em className="landing-accent-text font-semibold">chiến lợi phẩm.</em>
              </span>
            </h1>

            <div className="landing-route-divider" aria-hidden="true">
              <svg viewBox="0 0 1000 100" preserveAspectRatio="none" fill="none">
                <path className="landing-route-contour" d="M6 73C135 29 243 83 364 57C493 30 578 64 689 35C812 3 899 42 994 13" />
                <path className="landing-route-contour" d="M4 90C150 49 257 98 384 70C515 41 603 78 714 49C831 18 913 56 998 28" />
                <path className="landing-route-path" d="M12 78C143 35 242 87 366 59C501 29 586 67 696 37C817 4 905 43 988 14" />
              </svg>

              <span className="landing-route-node landing-route-node--start" />
              <span className="landing-route-node landing-route-node--checkpoint" />
              <span className="landing-route-node landing-route-node--destination">
                <Compass aria-hidden="true" />
              </span>
              <span className="landing-route-caption">Next / Field note 01</span>
            </div>

            <p className="landing-copy mt-1 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8">
              Biến mỗi từ vựng tiếng Anh thành một bước thăng hạng. Rèn luyện phản xạ với Flashcard 3D, giải mã ngữ cảnh Story Cloze và sở hữu những khung Avatar hoạt họa độc nhất.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={handleStart} className="landing-button-primary">
                <span>{landingActions.primary.label}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate("interactive-demo")}
                className="landing-button-secondary"
              >
                <Play className="landing-accent-text h-4 w-4 fill-current" />
                <span>{landingActions.tertiary.label}</span>
              </button>
            </div>
          </div>

          <aside className="landing-hero-specimen animate-reveal p-6 sm:p-8" aria-label="Bản xem trước flashcard Adventure">
            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-black/10 pb-4 dark:border-white/10">
                <div>
                  <p className="landing-label landing-brand-kicker">Field note / 01</p>
                  <p className="landing-copy mt-1 text-sm">Travel & Discovery</p>
                </div>
                <Compass className="landing-accent-text h-7 w-7" strokeWidth={1.5} />
              </div>

              <div className="py-10 sm:py-12">
                <div className="flex items-center gap-2">
                  <span className="landing-label text-xs font-semibold uppercase tracking-wider">noun</span>
                  <span className="landing-label">/</span>
                  <span className="landing-accent-text font-mono text-sm">/ədˈven.tʃər/</span>
                </div>
                <h2 className="landing-title mt-3 font-[var(--font-display)] text-5xl font-bold italic tracking-tight sm:text-6xl">
                  adventure
                </h2>
                <p className="landing-copy mt-4 max-w-sm text-sm leading-6">
                  Chuyến phiêu lưu — một trải nghiệm mới mẻ cần sự chủ động khám phá.
                </p>
              </div>

              <div className="border-t border-black/10 pt-4 dark:border-white/10">
                <div className="flex items-center justify-between gap-4">
                  <span className="landing-copy inline-flex items-center gap-2 text-xs font-semibold">
                    <BookOpenCheck className="landing-accent-text h-4 w-4" />
                    12 / 24 từ đã ôn
                  </span>
                  <span className="landing-label text-xs font-medium tabular-nums">50%</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                  <div className="landing-accent-fill h-full w-1/2 rounded-full" />
                </div>
              </div>
            </div>
          </aside>
        </div>

        <dl className="landing-signal-strip mt-12 grid sm:grid-cols-3 lg:mt-16">
          {landingHeroHighlights.map((signal) => (
            <div key={signal.label} className="landing-signal-item px-0 py-5 sm:px-6 sm:first:pl-0">
              <dt className="landing-label landing-brand-kicker">{signal.label}</dt>
              <dd className="landing-title mt-1 text-sm font-bold">{signal.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
