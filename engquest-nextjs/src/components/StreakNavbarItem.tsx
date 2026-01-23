"use client";

import { useState, useRef, useEffect } from "react";
import { Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StreakBoard from "@/components/StreakBoard";
import { cn } from "@/lib/utils";

// Define a compatible type locally or import if available
interface GamificationData {
    streak: number;
    lastLoginDate?: string | Date | null;
    xp?: number;
}

interface StreakNavbarItemProps {
    gamification: GamificationData;
}

export default function StreakNavbarItem({ gamification }: StreakNavbarItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const streak = gamification.streak || 0;

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 transition duration-200",
                    isOpen
                        ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-400"
                        : "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-500/30 dark:hover:text-orange-400"
                )}
            >
                <Flame
                    className={cn(
                        "h-4 w-4",
                        streak > 0 && "fill-orange-500 text-orange-500 animate-pulse"
                    )}
                />
                <span className="text-sm font-bold">{streak}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 z-50 w-[340px] md:w-[480px] lg:w-[560px]"
                    >
                        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/50">
                            <StreakBoard gamification={gamification} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
