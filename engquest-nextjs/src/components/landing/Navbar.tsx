"use client";
// Landing navigation that jumps guests into learner sections or opens the auth modal.

import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";
import ThemeToggle from "@/components/common/ThemeToggle";
import {
  landingActions,
  landingNavItems,
} from "@/components/landing/content";

type NavbarProps = {
  onNavigate: (id: string) => void;
  onOpenAuth?: (tab: "login" | "register") => void;
};

export default function Navbar({ onNavigate, onOpenAuth }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    if ((id === "login" || id === "register") && onOpenAuth) {
      onOpenAuth(id);
    } else {
      onNavigate(id);
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full">
      <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div
          className={`animate-fade-in-down flex items-center justify-between rounded-full border px-3 py-2.5 transition-all duration-300 sm:px-5 ${
            isScrolled
              ? "border-slate-200/80 bg-white/85 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85 dark:shadow-black/50"
              : "border-slate-200/50 bg-white/60 backdrop-blur-md dark:border-white/5 dark:bg-slate-950/60"
          }`}
        >
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleNavClick("hero")}
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-white/80 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
              <BrandLogo
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl"
                size={32}
              />
            </span>
            <span>
              <span className="block font-[var(--font-display)] text-base font-extrabold tracking-tight text-slate-950 dark:text-white">
                LingoLoot
              </span>
              <span className="block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                Quest & Loot
              </span>
            </span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300 lg:flex">
            {landingNavItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="transition hover:text-slate-950 dark:hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Login Text Link */}
            <button
              type="button"
              onClick={() => handleNavClick("login")}
              className="hidden sm:inline-flex text-xs font-bold text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white px-2 py-1"
            >
              Đăng nhập
            </button>

            {/* CTA Button */}
            <button
              type="button"
              onClick={() => handleNavClick(landingActions.primary.id)}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-200 hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <span>{landingActions.primary.label}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-slate-600 transition hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 lg:hidden"
              aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="animate-fade-in-down mt-2 overflow-hidden rounded-3xl border border-black/10 bg-white/95 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 lg:hidden">
            <div className="flex flex-col gap-1.5">
              {landingNavItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className="rounded-xl px-4 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  {item.label}
                </button>
              ))}
              <div className="my-2 h-px bg-slate-100 dark:bg-slate-800" />
              <button
                type="button"
                onClick={() => handleNavClick("login")}
                className="rounded-xl px-4 py-2 text-left text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => handleNavClick(landingActions.primary.id)}
                className="mt-1 rounded-xl bg-slate-900 py-3 text-center text-sm font-bold text-white shadow-md dark:bg-white dark:text-slate-900"
              >
                {landingActions.primary.label}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
