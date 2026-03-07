"use client";
// Admin sidebar navigation for moving between dashboard management areas.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { adminNavItems } from "@/constants/admin-nav";

export default function AdminSidebarNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-1 flex-col gap-2">
            {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                    pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors ${isActive
                            ? "text-indigo-600 dark:text-indigo-300"
                            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                            }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 shadow-sm dark:from-indigo-500/20 dark:to-blue-500/10 dark:shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]"
                                transition={{ type: "spring", duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">
                            <Icon className={`h-4 w-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-3'}`} />
                        </span>
                        <span className="relative z-10 font-medium tracking-wide">{item.label}</span>

                        {isActive && (
                            <motion.div
                                layoutId="active-indicator"
                                className="absolute left-0 h-8 w-1 rounded-r-full bg-indigo-500 dark:bg-indigo-400"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
