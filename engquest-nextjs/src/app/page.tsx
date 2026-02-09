"use client";

import { useCallback } from "react";
import { Manrope, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FlashcardMockup from "@/components/landing/FlashcardMockup";
import AuthTabs from "@/components/auth/AuthTabs";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import GamificationSection from "@/components/landing/GamificationSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
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
  const handleNavigate = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main
      className={`${manrope.variable} ${spaceGrotesk.variable} relative min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 font-[var(--font-body)] text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100`}
    >
      {/* Decorative background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl animate-pulse dark:bg-amber-500/10" />
        <div
          className="absolute bottom-0 -left-28 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl animate-pulse dark:bg-sky-500/10"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* Navigation */}
      <Navbar onNavigate={handleNavigate} />

      {/* Hero Section with Flashcard Mockup and Auth */}
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-14 pt-24 lg:flex-row lg:items-start lg:gap-8 lg:pt-16">
        <HeroSection />
        <FlashcardMockup />
        <section className="flex w-full flex-1 flex-col gap-6 lg:max-w-md">
          <AuthTabs />
        </section>
      </div>

      {/* Content Sections */}
      <HowItWorksSection />
      <GamificationSection />
      <TestimonialsSection />
      <CTASection onNavigate={handleNavigate} />
      <Footer onNavigate={handleNavigate} />
    </main>
  );
}
