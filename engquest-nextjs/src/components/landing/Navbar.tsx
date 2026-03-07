"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";
import ThemeToggle from "@/components/common/ThemeToggle";

type NavbarProps = {
    onNavigate: (id: string) => void;
};

const navItems = [
    { label: "Sản phẩm", id: "product" },
    { label: "Lộ trình", id: "flow" },
    { label: "Phần thưởng", id: "rewards" },
];

export default function Navbar({ onNavigate }: NavbarProps) {
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
        onNavigate(id);
    };

    return (
        <div className="sticky top-0 z-40 w-full">
            <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <div
                    className={`animate-fade-in-down flex items-center justify-between rounded-full border px-3 py-2.5 transition-all duration-300 sm:px-4 ${
                        isScrolled
                            ? "border-black/10 bg-white/82 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/82 dark:shadow-[0_20px_60px_-36px_rgba(2,6,23,0.95)]"
                            : "border-black/5 bg-white/60 backdrop-blur-lg dark:border-white/10 dark:bg-slate-950/60"
                    }`}
                >
                    <button
                        type="button"
                        onClick={() => handleNavClick("hero")}
                        className="flex items-center gap-3"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-white/75 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
                            <BrandLogo
                                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl"
                                size={32}
                            />
                        </span>
                        <span className="hidden sm:block">
                            <span className="block font-[var(--font-display)] text-base font-semibold tracking-tight text-slate-950 dark:text-white">
                                LingoLoot
                            </span>
                            <span className="block text-[0.68rem] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                                Learner workspace
                            </span>
                        </span>
                    </button>

                    <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 lg:flex">
                        {navItems.map((item) => (
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

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            type="button"
                            onClick={() => handleNavClick("login")}
                            className="hidden rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:text-white sm:block"
                        >
                            Đăng nhập
                        </button>
                        <button
                            type="button"
                            onClick={() => handleNavClick("register")}
                            className="hidden items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.75)] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:shadow-[0_18px_40px_-24px_rgba(255,255,255,0.4)] dark:hover:bg-slate-100 sm:inline-flex"
                        >
                            Bắt đầu ngay
                            <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/75 text-slate-600 transition hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08] lg:hidden"
                            aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="animate-fade-in-down mt-2 overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/90 p-4 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90 dark:shadow-[0_24px_60px_-32px_rgba(2,6,23,0.95)] lg:hidden">
                        <div className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleNavClick(item.id)}
                                    className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[0.06]"
                                >
                                    {item.label}
                                </button>
                            ))}
                            <div className="my-2 h-px bg-black/10 dark:bg-white/10" />
                            <button
                                type="button"
                                onClick={() => handleNavClick("login")}
                                className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
                            >
                                Đăng nhập
                            </button>
                            <button
                                type="button"
                                onClick={() => handleNavClick("register")}
                                className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.8)] transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:shadow-[0_18px_40px_-28px_rgba(255,255,255,0.35)] dark:hover:bg-slate-100"
                            >
                                Bắt đầu ngay
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
