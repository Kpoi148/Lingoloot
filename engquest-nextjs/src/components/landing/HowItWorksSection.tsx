"use client";
// Modern interactive journey rail illustrating the 4-step learning quest with visual placeholders.

import {
  BookOpenText,
  BrainCircuit,
  Gamepad2,
  Layers3,
  Play,
  ChevronRight,
} from "lucide-react";
import { AnimatedSection } from "@/components/common/AnimatedSection";
import { landingFlowSteps } from "@/components/landing/content";

const stepIcons = [Layers3, BookOpenText, BrainCircuit, Gamepad2];

export default function HowItWorksSection() {
  return (
    <AnimatedSection
      id="journey"
      className="relative mx-auto w-full max-w-7xl scroll-mt-28 px-4 pb-20 pt-8 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="mb-12 max-w-2xl space-y-3 text-center sm:text-left">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
          CHƯƠNG 03 &mdash; LỘ TRÌNH 4 BƯỚC
        </p>
        <h2 className="font-[var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          Lộ trình 4 chặng để khắc sâu một bộ từ.
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          Mỗi phiên học được thiết kế khoa học trong 10-15 phút: đi từ tiếp nhận trực giác, luyện phản xạ đến ghi nhớ ngữ cảnh dài hạn.
        </p>
      </div>

      {/* Grid: 4 Steps + Media Showcase Slot */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left Column: 4 Milestone Steps with connecting rail (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {landingFlowSteps.map((item, index) => {
            const Icon = stepIcons[index];

            return (
              <div
                key={item.step}
                className="group relative flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-white/20"
              >
                {/* Step Icon Badge */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:scale-105 group-hover:bg-amber-500/10 group-hover:text-amber-600 dark:bg-white/5 dark:text-slate-200 dark:group-hover:bg-amber-400/10 dark:group-hover:text-amber-400">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Step Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      CHẶNG {item.step}
                    </span>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Visual Video / Gameplay Screenshot Placeholder Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-gradient-to-b from-slate-100/90 to-slate-200/50 p-6 text-center shadow-lg dark:border-slate-800 dark:from-slate-900/80 dark:to-slate-950/60 sm:p-8">
            
            {/* Play Badge Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30">
              <Play className="h-6 w-6 fill-current ml-0.5" />
            </div>

            <span className="mt-4 inline-block rounded-full bg-slate-200 px-3 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-white/10 dark:text-slate-300">
              Khung chờ Video / Ảnh thực tế
            </span>

            <h4 className="mt-2 font-[var(--font-display)] text-lg font-bold text-slate-900 dark:text-white">
              Ghi lại khoảnh khắc kéo thả Story Cloze
            </h4>

            <p className="mx-auto mt-2 max-w-xs text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Vị trí này được thiết kế sẵn để bạn nhúng video MP4/GIF hoặc ảnh chụp màn hình lúc chơi minigame Story Cloze thật trong app.
            </p>

            <div className="mt-6 rounded-xl border border-black/5 bg-white/70 p-3 text-left text-xs text-slate-600 dark:border-white/5 dark:bg-slate-900/60 dark:text-slate-300">
              <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Format khuyến nghị:</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Video MP4 / WebM ngắn (5-10s lặp loop, 1080p hoặc 720p) hoặc ảnh PNG tỷ lệ 16:9 sắc nét.
              </p>
            </div>

          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
