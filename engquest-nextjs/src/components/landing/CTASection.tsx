"use client";
// Landing closeout section that invites learners to create an account or log in.

import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/common/AnimatedSection";
import { landingActions } from "@/components/landing/content";

type CTASectionProps = {
  onNavigate: (id: string) => void;
  onOpenAuth?: (tab: "login" | "register") => void;
};

export default function CTASection({ onNavigate, onOpenAuth }: CTASectionProps) {
  const handlePrimary = () => {
    if (onOpenAuth) {
      onOpenAuth("register");
    } else {
      onNavigate(landingActions.primary.id);
    }
  };

  const handleSecondary = () => {
    if (onOpenAuth) {
      onOpenAuth("login");
    } else {
      onNavigate(landingActions.secondary.id);
    }
  };

  return (
    <AnimatedSection className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#090A0F] px-8 py-14 text-white shadow-2xl shadow-slate-950/80 sm:px-14 sm:py-16">
        
        {/* Subtle radial glow from bottom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl"
        />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400/90 font-mono">
              BƯỚC TIẾP THEO &mdash; SẴN SÀNG KHỞI HÀNH
            </p>
            <h2 className="font-[var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-5xl sm:leading-tight">
              Khởi đầu lượt học đầu tiên ngay hôm nay.
            </h2>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              Tạo tài khoản miễn phí để lưu lại toàn bộ tiến độ, ngọn lửa Streak và những khung bảo vật độc quyền bạn kiếm được.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handlePrimary}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-white/20 transition hover:bg-slate-100 active:scale-95 sm:px-8 sm:py-4"
            >
              <span>{landingActions.primary.label}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleSecondary}
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10 active:scale-95 sm:px-8 sm:py-4"
            >
              {landingActions.secondary.label}
            </button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
