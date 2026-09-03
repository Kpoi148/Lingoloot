"use client";
// Public landing page that introduces the learner flow and provides interactive, anti-AI-slop experience.

import { useCallback, useEffect, useState } from "react";
import { Manrope, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import InteractivePlayground from "@/components/landing/InteractivePlayground";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import LootShowcase from "@/components/landing/LootShowcase";
import GamificationSection from "@/components/landing/GamificationSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import AuthModal from "@/components/landing/AuthModal";
import type { AuthTab } from "@/components/auth/AuthTabs";

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  const handleOpenAuth = useCallback((tab: AuthTab = "login") => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const handleNavigate = useCallback((id: string) => {
    if (id === "login" || id === "register") {
      handleOpenAuth(id);
      return;
    }

    const target = document.getElementById(id);
    if (!target) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [handleOpenAuth]);

  return (
    <main
      className={`${manrope.variable} ${spaceGrotesk.variable} relative min-h-screen [overflow-x:clip] bg-[#FAF8F5] font-[var(--font-body)] text-slate-900 transition-colors duration-300 dark:bg-[#07090E] dark:text-slate-100`}
    >
      {/* Subtle, elegant ambient lighting (No harsh AI blur-3xl blobs) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-10rem] h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-2xl dark:from-amber-400/10 dark:via-purple-500/5" />
      </div>

      {/* Sticky Navigation */}
      <Navbar onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />

      {/* Hero Section Container (Wide & Uncluttered) */}
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeroSection onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />
      </div>

      {/* Interactive Living Demo (3D Flashcard & Playable Story Cloze) */}
      <InteractivePlayground onOpenAuth={() => handleOpenAuth("register")} />

      {/* 4-Stage Learning Journey with Video/Screenshot Slot */}
      <HowItWorksSection />

      {/* Loot Vault: AI Animated SVG Frames Showcase */}
      <LootShowcase onOpenAuth={() => handleOpenAuth("register")} />

      {/* Gamification, Streak Fire & Adventurer Pass */}
      <GamificationSection onOpenAuth={() => handleOpenAuth("register")} />

      {/* Closing CTA */}
      <CTASection onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Accessible Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authTab}
      />
    </main>
  );
}
