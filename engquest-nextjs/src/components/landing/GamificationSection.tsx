"use client";
// Landing section that showcases streaks, XP leveling, and learner profile rewards.

import { Flame, Gem, Gift, Trophy, Sparkles, Check, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/common/AnimatedSection";

const streakDays = [
  { label: "T2", active: true, xp: 50 },
  { label: "T3", active: true, xp: 60 },
  { label: "T4", active: true, xp: 70 },
  { label: "T5", active: true, xp: 80 },
  { label: "T6", active: true, xp: 90 },
  { label: "T7", active: true, xp: 100 },
  { label: "CN", active: false, xp: 150, isChest: true },
];

export default function GamificationSection({ onOpenAuth }: { onOpenAuth?: () => void }) {
  return (
    <AnimatedSection
      id="streak"
      className="landing-section landing-section--raised landing-reveal scroll-mt-28 py-16 sm:py-20"
    >
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-12 max-w-2xl space-y-3 text-center sm:text-left">
        <p className="landing-label landing-kicker">
          CHƯƠNG 05 &mdash; CHUỖI LỬA CHUYÊN CẦN & VINH DANH
        </p>
        <h2 className="landing-title font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          Chuỗi ngày học & Bảng vàng vinh danh.
        </h2>
        <p className="landing-copy text-sm sm:text-base">
          Không còn cảm giác học một mình hay nản chí. Mỗi lượt hoàn thành duy trì ngọn lửa Streak và tích lũy phần thưởng tăng dần mỗi ngày.
        </p>
      </div>

      {/* Main Grid: Adventurer Card (Left) + Level & Gems Progress (Right) */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
        
        {/* Left Column: 7-Day Flame Streak Board (7 cols) */}
        <div className="landing-product-panel lg:col-span-7 flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="landing-accent-text flex h-12 w-12 items-center justify-center">
                  <Flame className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="landing-title font-[var(--font-display)] text-2xl font-bold">
                    Chuỗi chuyên cần 7 ngày
                  </h3>
                  <p className="landing-copy text-xs">
                    Duy trì 6 ngày liên tiếp • Nhận thưởng Rương Chủ Nhật
                  </p>
                </div>
              </div>

              <span className="landing-accent-text text-sm font-extrabold tabular-nums">
                6 ngày
              </span>
            </div>

            {/* Streak 7 Days Row */}
            <div className="mt-8 grid grid-cols-7 gap-2 sm:gap-3">
              {streakDays.map((day) => (
                <div
                  key={day.label}
                  className={`flex flex-col items-center justify-between rounded-2xl border py-3 px-1 text-center transition-all ${
                    day.active
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : day.isChest
                      ? "border-amber-400 bg-amber-50/80 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300"
                      : "border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-950/40"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {day.label}
                  </span>

                  <div className="my-2 flex h-8 w-8 items-center justify-center">
                    {day.active ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    ) : day.isChest ? (
                      <Gift className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                    )}
                  </div>

                  <span className="landing-micro font-bold">
                    +{day.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-product-panel--quiet landing-copy mt-8 p-4 text-xs">
            <p className="landing-title flex items-center gap-2 font-semibold">
              <Sparkles className="landing-accent-text h-4 w-4" />
              <span>Cơ chế bảo toàn ngọn lửa:</span>
            </p>
            <p className="mt-1 leading-relaxed">
              Mỗi ngày bạn chỉ cần hoàn thành tối thiểu 1 chủ đề (khoảng 5-10 phút) để ngọn lửa không bị dập tắt và mở khóa rương quà tuần.
            </p>
          </div>
        </div>

        {/* Right Column: Adventurer Pass & Rank Tier (5 cols) */}
        <div className="landing-product-panel lg:col-span-5 flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Hồ sơ Người Học
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Đang hoạt động
              </span>
            </div>

            {/* Level Rank Badge */}
            <div className="mt-6 flex items-center gap-4">
              <div className="landing-accent-fill flex h-16 w-16 items-center justify-center rounded-xl text-white">
                <Trophy className="h-8 w-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Danh hiệu bậc 2
                </span>
                <h4 className="landing-title font-[var(--font-display)] text-3xl font-bold">
                  Lv. 4 • Học Giả
                </h4>
                <p className="landing-copy text-xs">
                  Cần thêm 80 XP để chạm mốc Chuyên Gia
                </p>
              </div>
            </div>

            {/* Level XP Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Tiến độ Level</span>
                <span>320 / 400 XP (80%)</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-200/70 p-0.5 dark:bg-slate-800">
                <div className="landing-accent-fill h-full w-4/5 rounded-full" />
              </div>
            </div>

            {/* Gems Currency Counter */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="landing-product-panel--quiet p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Gem className="h-4 w-4 text-emerald-500" />
                  <span>Kho đá quý</span>
                </div>
                <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                  125 <span className="text-xs font-normal text-slate-400">Gems</span>
                </p>
              </div>

              <div className="landing-product-panel--quiet p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Sparkles className="landing-accent-text h-4 w-4" />
                  <span>Vật phẩm sở hữu</span>
                </div>
                <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                  03 <span className="text-xs font-normal text-slate-400">Khung</span>
                </p>
              </div>
            </div>
          </div>

          {/* CTA Link to auth */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onOpenAuth}
              className="landing-button-primary group w-full justify-between"
            >
              <span>Gia nhập ngay để bắt đầu tích lũy XP</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
          </div>
        </div>

      </div>
      </div>
    </AnimatedSection>
  );
}
