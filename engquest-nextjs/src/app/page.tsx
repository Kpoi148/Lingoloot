"use client";

import { useCallback, useEffect, useState } from "react";
import { Manrope, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FlashcardMockup from "@/components/landing/FlashcardMockup";
import AuthTabs, { type AuthTab } from "@/components/auth/AuthTabs";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import GamificationSection from "@/components/landing/GamificationSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

// Font configurations
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export default function HomePage() {
  const [authTab, setAuthTab] = useState<AuthTab>("login");

  useEffect(() => {
    let isEmbeddedPreview = false;

    try {
      isEmbeddedPreview = window.self !== window.top;
    } catch {
      isEmbeddedPreview = true;
    }

    if (!isEmbeddedPreview) {
      return;
    }

    document.documentElement.classList.add("landing-embedded-preview");
    document.body.classList.add("landing-embedded-preview");

    return () => {
      document.documentElement.classList.remove("landing-embedded-preview");
      document.body.classList.remove("landing-embedded-preview");
    };
  }, []);

  const handleNavigate = useCallback((id: string) => {
    let targetId = id;

    if (id === "login" || id === "register") {
      setAuthTab(id);
      targetId = "auth-section";
    }

    const target = document.getElementById(targetId);
    if (!target) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  return (
    <main
      className={`${manrope.variable} ${spaceGrotesk.variable} relative min-h-screen [overflow-x:clip] bg-[#f5f7fb] font-[var(--font-body)] text-slate-950 dark:bg-[#020617] dark:text-slate-100`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="landing-grid absolute inset-0 opacity-60" />
        <div className="absolute left-1/2 top-[-8rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.16),transparent_68%)] dark:bg-[radial-gradient(circle,rgba(52,211,153,0.14),transparent_70%)]" />
        <div
          className="animate-drift absolute -left-20 top-[28rem] h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/10"
          style={{ animationDelay: "-5s" }}
        />
        <div
          className="animate-drift absolute -right-20 top-24 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-500/10"
          style={{ animationDelay: "-2s" }}
        />
      </div>

      <Navbar onNavigate={handleNavigate} />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_400px] xl:items-start">
          <div className="space-y-6 lg:space-y-8">
            <HeroSection onNavigate={handleNavigate} />
            <FlashcardMockup />
          </div>

          <section className="landing-panel relative rounded-[2rem] p-5 sm:p-6 xl:sticky xl:top-28">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_58%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]"
            />
            <div className="relative">
              <div className="mb-6 space-y-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
                  Quick access
                </p>
                <h2 className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  Bắt đầu phiên học đầu tiên hoặc tiếp tục streak hiện tại.
                </h2>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Landing này dẫn thẳng vào khu vực learner: topics,
                  flashcards, quiz, Story Cloze, rewards và shop hồ sơ.
                </p>
              </div>

              <div className="mb-5 flex flex-wrap gap-2">
                {["Topics", "Flashcards", "Quiz", "Story Cloze", "Shop"].map(
                  (item) => (
                    <span
                      key={item}
                      className="inline-flex rounded-full border border-black/10 bg-white/65 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>

              <AuthTabs activeTab={authTab} />
            </div>
          </section>
        </div>
      </div>

      <HowItWorksSection />
      <GamificationSection />
      <CTASection onNavigate={handleNavigate} />
      <Footer onNavigate={handleNavigate} />
    </main>
  );
}
