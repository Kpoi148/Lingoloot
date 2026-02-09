"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

type NavbarProps = {
    onNavigate: (id: string) => void;
};

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
            <div className="mx-auto w-full max-w-6xl px-4">
                <div
                    className={`mt-4 flex items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 sm:px-6 animate-fade-in-down ${isScrolled
                            ? "border-white/60 bg-white/75 shadow-lg shadow-slate-200/70 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-slate-950/40"
                            : "border-transparent bg-white/0 dark:border-transparent dark:bg-transparent"
                        }`}
                >
                    <button
                        type="button"
                        onClick={() => handleNavClick("hero")}
                        className="font-[var(--font-display)] text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100"
                    >
                        LingoLoot
                    </button>

                    <div className="hidden items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300 sm:flex">
                        <button
                            type="button"
                            onClick={() => handleNavClick("features")}
                            className="transition hover:text-slate-900 dark:hover:text-white"
                        >
                            Tính năng
                        </button>
                        <button
                            type="button"
                            onClick={() => handleNavClick("how-it-works")}
                            className="transition hover:text-slate-900 dark:hover:text-white"
                        >
                            Cách học
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            type="button"
                            onClick={() => handleNavClick("register")}
                            className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:shadow-slate-950/40 dark:hover:bg-slate-100 sm:block"
                        >
                            Bắt đầu ngay
                        </button>
                        {/* Hamburger Menu Button - Mobile Only */}
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 sm:hidden"
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

                {/* Mobile Menu Drawer */}
                {isMobileMenuOpen && (
                    <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 p-4 shadow-xl backdrop-blur animate-fade-in-down dark:border-slate-800/70 dark:bg-slate-900/95 sm:hidden">
                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => handleNavClick("features")}
                                className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Tính năng
                            </button>
                            <button
                                type="button"
                                onClick={() => handleNavClick("how-it-works")}
                                className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Cách học
                            </button>
                            <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />
                            <button
                                type="button"
                                onClick={() => handleNavClick("register")}
                                className="rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:shadow-slate-950/40 dark:hover:bg-slate-100"
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
