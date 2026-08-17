"use client";
// Reusable theme switcher used across public and authenticated surfaces.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme ?? "system";
  const displayTheme =
    currentTheme === "system" ? resolvedTheme : currentTheme;
  const isDark = displayTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Theme toggle"
        className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 ${className ?? ""}`}
      >
        <span className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      title={`Theme: ${currentTheme}. Click to switch to ${nextTheme}.`}
      aria-label={`Switch theme to ${nextTheme}`}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-600 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 ${className ?? ""}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "dark" : "light"}
          initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </motion.span>
      </AnimatePresence>
      {currentTheme === "system" && (
        <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full bg-sky-400 shadow" />
      )}
    </button>
  );
}
