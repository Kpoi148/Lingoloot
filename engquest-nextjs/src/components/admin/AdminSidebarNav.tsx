"use client";

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
                // Check exact match for root "/admin", or startWith for others (but handle "/admin" vs "/admin/abc" correctly)
                // Actually for /admin root we want exact match, for others like /admin/shop we might want sub-paths?
                // Let's stick to exact logic or simple logic first.
                // Good logic: active if pathname === item.href OR pathname startsWith item.href + "/"
                const isActive =
                    pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`relative flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors ${isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                            }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 rounded-2xl bg-slate-100"
                                transition={{ type: "spring", duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">
                            <Icon className="h-4 w-4" />
                        </span>
                        <span className="relative z-10">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
