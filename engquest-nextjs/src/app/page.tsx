"use client";
// Public landing page that introduces the learner flow and provides interactive, anti-AI-slop experience.

import { useCallback, useEffect, useState } from "react";
import { Manrope, Newsreader } from "next/font/google";
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
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
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
      className={`${manrope.variable} ${newsreader.variable} landing-shell min-h-screen [overflow-x:clip] font-[var(--font-body)] antialiased`}
    >
      {/* Sticky Navigation */}
      <Navbar onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />

      {/* Full-bleed editorial hero */}
      <HeroSection onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />

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
