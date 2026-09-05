"use client";
// Modern interactive journey rail with scroll-driven amber beam and milestone illumination.

import { useEffect, useRef, useState } from "react";
import {
  BookOpenText,
  BrainCircuit,
  Gamepad2,
  Layers3,
  Play,
  ChevronRight,
} from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { AnimatedSection } from "@/components/common/AnimatedSection";
import { landingFlowSteps } from "@/components/landing/content";

const stepIcons = [Layers3, BookOpenText, BrainCircuit, Gamepad2];

export default function HowItWorksSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Track scroll progress through this journey section
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 75%", "end 55%"],
  });

  // Liquid spring smoothing for the beam progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
  });

  // Beam height matches scroll progress 1:1 along the 369px track
  const beamHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  // Bead fades in after launch and dissolves as it enters Chặng 04
  const beadOpacity = useTransform(smoothProgress, [0, 0.04, 0.94, 1.0], [0, 1, 1, 0]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
    }
  }, []);

  // Update active step strictly when the beam/bead touches each milestone (zero premature lighting, zero lag on retreat)
  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveStep(3);
      return;
    }

    return smoothProgress.on("change", (progress) => {
      // Exactly at marker entry points: Chặng 04 (94%), Chặng 03 (64%), Chặng 02 (31%)
      if (progress >= 0.94) {
        setActiveStep(3);
      } else if (progress >= 0.64) {
        setActiveStep(2);
      } else if (progress >= 0.31) {
        setActiveStep(1);
      } else {
        setActiveStep(0);
      }
    });
  }, [smoothProgress, prefersReducedMotion]);

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

        {/* Grid: 4 Steps with Scroll Rail (Left) + Media Slot (Right) */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: 4 Milestone Steps with connecting scroll rail (7 cols) */}
          <div ref={railRef} className="relative space-y-6 lg:col-span-7">
            
            {/* Rail Track Container (aligned at marker centers x = 24px, terminates inside 4th badge) */}
            <div
              aria-hidden="true"
              className="absolute left-6 top-6 bottom-12 w-[2px] -translate-x-1/2 pointer-events-none"
            >
              {/* Muted Base Track */}
              <div className="h-full w-full rounded-full bg-slate-200/80 dark:bg-slate-800" />

              {/* Glowing Active Beam with Head Bead Physically Anchored to its Tip */}
              {!prefersReducedMotion ? (
                <motion.div
                  style={{ height: beamHeight }}
                  className="absolute top-0 left-0 w-full rounded-full bg-gradient-to-b from-amber-500 via-amber-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.65)]"
                >
                  {/* Head Bead: Directly anchored at bottom-0 of the beam so it can NEVER detach */}
                  <motion.span
                    style={{ opacity: beadOpacity }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-3.5 w-3.5 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b] ring-2 ring-white dark:ring-slate-900"
                  />
                </motion.div>
              ) : (
                <div className="absolute top-0 left-0 h-full w-full rounded-full bg-amber-500" />
              )}
            </div>

            {/* 4 Journey Step Milestones */}
            {landingFlowSteps.map((item, index) => {
              const Icon = stepIcons[index];
              const isPassedOrActive = index <= activeStep;

              return (
                <div
                  key={item.step}
                  className="group relative flex items-start gap-4 sm:gap-5"
                >
                  {/* Step Marker on the Rail */}
                  <div className="relative">
                    <div
                      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-500 ${
                        isPassedOrActive
                          ? "border-amber-500/80 bg-white text-amber-600 shadow-md shadow-amber-500/20 ring-4 ring-amber-500/10 dark:border-amber-400 dark:bg-slate-900 dark:text-amber-400 scale-[1.04]"
                          : "border-slate-200/90 bg-white text-slate-400 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-500 group-hover:border-slate-300 dark:group-hover:border-slate-700"
                      }`}
                    >
                      <Icon className="h-5 w-5 transition duration-300 group-hover:scale-110" />
                    </div>
                  </div>

                  {/* Step Information Card */}
                  <div
                    className={`flex-1 rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
                      isPassedOrActive
                        ? "border-slate-200/80 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/60"
                        : "border-transparent bg-transparent hover:border-slate-200/60 hover:bg-white/50 dark:hover:border-white/5 dark:hover:bg-slate-900/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-xs font-bold transition-colors ${
                          isPassedOrActive
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        CHẶNG {item.step}
                      </span>
                      <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600" />
                      <h3 className="landing-title text-base sm:text-lg font-bold">
                        {item.title}
                      </h3>
                    </div>
                    <p className="landing-copy mt-1.5 text-xs leading-relaxed sm:text-sm">
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
