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
      className="landing-section landing-reveal scroll-mt-28 py-16 sm:py-20"
    >
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 max-w-2xl space-y-3 text-center sm:text-left">
        <p className="landing-label landing-kicker">
          CHƯƠNG 03 &mdash; LỘ TRÌNH 4 BƯỚC
        </p>
        <h2 className="landing-title font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          Lộ trình 4 chặng để khắc sâu một bộ từ.
        </h2>
        <p className="landing-copy text-sm sm:text-base">
          Mỗi phiên học được thiết kế khoa học trong 10-15 phút: đi từ tiếp nhận trực giác, luyện phản xạ đến ghi nhớ ngữ cảnh dài hạn.
        </p>
      </div>

      {/* Grid: 4 Steps + Media Showcase Slot */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left Column: 4 Milestone Steps with connecting rail (7 cols) */}
        <div className="landing-journey-rail space-y-0 lg:col-span-7">
          {landingFlowSteps.map((item, index) => {
            const Icon = stepIcons[index];

            return (
              <div
                key={item.step}
                className="landing-journey-step group flex items-start gap-4 pl-1"
              >
                {/* Step Icon Badge */}
                <div className="landing-step-marker flex h-12 w-12 shrink-0 items-center justify-center transition">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Step Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="landing-accent-text font-mono text-xs font-bold">
                      CHẶNG {item.step}
                    </span>
                    <ChevronRight className="landing-label h-3 w-3" />
                    <h3 className="landing-title text-base font-bold">
                      {item.title}
                    </h3>
                  </div>
                  <p className="landing-copy mt-1 text-xs leading-relaxed sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Visual Video / Gameplay Screenshot Placeholder Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="landing-media-placeholder relative overflow-hidden p-6 text-center sm:p-8">
            
            {/* Play Badge Icon */}
            <div className="landing-accent-text mx-auto flex h-14 w-14 items-center justify-center">
              <Play className="h-6 w-6 fill-current ml-0.5" />
            </div>

            <span className="landing-label landing-brand-kicker mt-4 inline-block">
              Khung chờ Video / Ảnh thực tế
            </span>

            <h4 className="landing-title mt-3 font-[var(--font-display)] text-2xl font-bold">
              Ghi lại khoảnh khắc kéo thả Story Cloze
            </h4>

            <p className="landing-copy mx-auto mt-2 max-w-xs text-xs leading-relaxed">
              Vị trí này được thiết kế sẵn để bạn nhúng video MP4/GIF hoặc ảnh chụp màn hình lúc chơi minigame Story Cloze thật trong app.
            </p>

            <div className="landing-product-panel--quiet landing-copy mt-6 p-3 text-left text-xs">
              <div className="landing-accent-text landing-micro flex items-center gap-2 font-mono">
                <span className="landing-accent-fill h-2 w-2 rounded-full" />
                <span>Format khuyến nghị:</span>
              </div>
              <p className="landing-micro mt-1 text-slate-500">
                Video MP4 / WebM ngắn (5-10s lặp loop, 1080p hoặc 720p) hoặc ảnh PNG tỷ lệ 16:9 sắc nét.
              </p>
            </div>

          </div>
        </div>
      </div>
      </div>
    </AnimatedSection>
  );
}
