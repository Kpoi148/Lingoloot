"use client";
// Mobile drawer and header navigation for Admin portal on small screens.

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";
import AdminSidebarNav from "./AdminSidebarNav";
import AdminSidebarProfile from "./AdminSidebarProfile";
import AdminTopbarActions from "./AdminTopbarActions";
import type { UserProfile } from "@/actions/user/profile.actions";
import type { ShopVisualItem } from "@/types/shop-item";

type AdminMobileHeaderProps = {
  profile: UserProfile | null;
  shopItems: ShopVisualItem[];
};

export default function AdminMobileHeader({
  profile,
  shopItems,
}: AdminMobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer when path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/90 md:hidden">
      <div className="flex items-center justify-between gap-2">
        {/* Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle admin navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <BrandLogo className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white shadow dark:bg-white dark:text-slate-900" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Admin
            </span>
          </Link>
        </div>

        {/* Topbar Actions */}
        <AdminTopbarActions />
      </div>

      {/* Slide-over Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Sidebar Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex w-4/5 max-w-xs flex-col border-r border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800/60">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onClick={() => setIsOpen(false)}
                >
                  <BrandLogo className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white shadow dark:bg-white dark:text-slate-900" />
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                      LingoLoot
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      Admin Portal
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                <AdminSidebarNav />
              </div>

              <div className="mt-auto border-t border-slate-100 pt-3 dark:border-slate-800/60">
                <AdminSidebarProfile profile={profile} shopItems={shopItems} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
