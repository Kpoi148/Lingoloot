"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type Tab = "login" | "register";

type AuthTabsProps = {
    defaultTab?: Tab;
};

export default function AuthTabs({ defaultTab = "login" }: AuthTabsProps) {
    const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

    const tabs: { id: Tab; label: string }[] = [
        { id: "login", label: "Đăng nhập" },
        { id: "register", label: "Tạo tài khoản" },
    ];

    return (
        <div id="auth-section" className="w-full max-w-md scroll-mt-28">
            {/* Tab Buttons */}
            <div className="mb-4 flex rounded-2xl border border-slate-200/70 bg-white/60 p-1.5 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/60">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${activeTab === tab.id
                                ? "text-slate-900 dark:text-slate-100"
                                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            }`}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 rounded-xl bg-white shadow-lg shadow-slate-200/60 dark:bg-slate-800 dark:shadow-slate-950/40"
                                transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                            />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div id="register" className="scroll-mt-28">
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
