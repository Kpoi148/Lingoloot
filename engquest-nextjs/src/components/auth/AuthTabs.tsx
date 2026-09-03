"use client";
// Auth card switcher that keeps login and registration in one landing surface.

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export type AuthTab = "login" | "register";

type AuthTabsProps = {
    defaultTab?: AuthTab;
    activeTab?: AuthTab;
};

export default function AuthTabs({
    defaultTab = "login",
    activeTab: preferredTab,
}: AuthTabsProps) {
    const [activeTab, setActiveTab] = useState<AuthTab>(preferredTab ?? defaultTab);

    useEffect(() => {
        if (preferredTab) {
            setActiveTab(preferredTab);
        }
    }, [preferredTab]);

    const tabs: { id: AuthTab; label: string }[] = [
        { id: "login", label: "Đăng nhập" },
        { id: "register", label: "Tạo tài khoản" },
    ];

    return (
        <div id="auth-section" className="w-full scroll-mt-32">
            {/* Tab Buttons */}
            <div className="mb-4 flex rounded-xl border border-slate-200/80 bg-slate-100/70 p-1 backdrop-blur dark:border-white/10 dark:bg-white/5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-colors duration-200 ${
                            activeTab === tab.id
                                ? "text-slate-950 dark:text-white"
                                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        }`}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-slate-800"
                                transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                            />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="scroll-mt-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {activeTab === "login" ? (
                            <LoginForm />
                        ) : (
                            <RegisterForm />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
