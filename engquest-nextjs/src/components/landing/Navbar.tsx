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
          data-scrolled={isScrolled}
          className="landing-nav-surface animate-fade-in-down flex items-center justify-between px-3 py-2.5 transition-all duration-300 sm:px-5"
        >
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleNavClick("hero")}
            className="flex items-center gap-3 rounded-lg text-left"
          >
            <span className="landing-product-panel--quiet flex h-10 w-10 items-center justify-center">
              <BrandLogo
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg"
                size={32}
                priority
              />
            </span>
            <span>
              <span className="landing-title block font-[var(--font-display)] text-lg font-extrabold leading-none tracking-tight">
                LingoLoot
              </span>
              <span className="landing-accent-text landing-brand-kicker mt-1 block">
                Quest & Loot
              </span>
            </span>
          </button>

          {/* Desktop Nav Links */}
          <div className="landing-copy hidden items-center gap-7 text-sm font-semibold lg:flex">
            {landingNavItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="landing-nav-link rounded-md"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <ThemeToggle className="landing-theme-toggle" />

            {/* Login Text Link */}
            <button
              type="button"
              onClick={() => handleNavClick("login")}
              className="landing-nav-link hidden rounded-md px-2 py-1 text-xs font-bold sm:inline-flex"
            >
              Đăng nhập
            </button>

            {/* CTA Button */}
            <button
              type="button"
              onClick={() => handleNavClick(landingActions.primary.id)}
              className="landing-nav-action"
            >
              <span>{landingActions.primary.label}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="landing-product-panel--quiet landing-nav-link flex h-9 w-9 items-center justify-center lg:hidden"
              aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="landing-nav-surface animate-fade-in-down mt-2 overflow-hidden p-4 lg:hidden">
            <div className="flex flex-col gap-1.5">
              {landingNavItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className="landing-nav-menu-item rounded-lg px-4 py-2.5 text-left text-sm font-bold"
                >
                  {item.label}
                </button>
              ))}
              <div className="landing-divider my-2 h-px" />
              <button
                type="button"
                onClick={() => handleNavClick("login")}
                className="landing-copy rounded-lg px-4 py-2 text-left text-sm font-bold"
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => handleNavClick(landingActions.primary.id)}
                className="landing-button-primary mt-1 w-full"
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
