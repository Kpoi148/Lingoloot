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
    <AnimatedSection className="landing-section landing-section--ink landing-reveal py-16 sm:py-20">
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3 max-w-2xl">
            <p className="landing-accent-text landing-kicker font-mono">
              BƯỚC TIẾP THEO &mdash; SẴN SÀNG KHỞI HÀNH
            </p>
            <h2 className="landing-inverted-title font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-6xl sm:leading-tight">
              Khởi đầu lượt học đầu tiên ngay hôm nay.
            </h2>
            <p className="landing-inverted-copy text-sm leading-relaxed sm:text-base">
              Tạo tài khoản miễn phí để lưu lại toàn bộ tiến độ, ngọn lửa Streak và những khung bảo vật độc quyền bạn kiếm được.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handlePrimary}
              className="landing-ink-button-primary"
            >
              <span>{landingActions.primary.label}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleSecondary}
              className="landing-ink-button-secondary"
            >
              {landingActions.secondary.label}
            </button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
