"use client";
// Modern interactive journey rail with scroll-driven amber beam and milestone illumination.

import { useEffect, useRef, useState } from "react";
import {
  BookOpenText,
  BrainCircuit,
  Gamepad2,
  Layers3,
  ChevronRight,
} from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { AnimatedSection } from "@/components/common/AnimatedSection";
import { landingFlowSteps } from "@/components/landing/content";
import {
  LANDING_DESKTOP_QUERY,
  LANDING_REDUCED_MOTION_QUERY,
  useLandingMediaQuery,
} from "@/components/landing/useLandingMedia";

const stepIcons = [Layers3, BookOpenText, BrainCircuit, Gamepad2];

function JourneySteps({ activeStep }: { activeStep: number }) {
  return landingFlowSteps.map((item, index) => {
    const Icon = stepIcons[index];
    const isPassedOrActive = index <= activeStep;

    return (
      <div key={item.step} className="group relative flex items-start gap-4 sm:gap-5">
        <div className="relative">
          <div
            className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 ${
              isPassedOrActive
                ? "border-amber-500/80 bg-white text-amber-600 shadow-md shadow-amber-500/20 ring-4 ring-amber-500/10 dark:border-amber-400 dark:bg-slate-900 dark:text-amber-400 lg:scale-[1.04]"
                : "border-slate-200/90 bg-white text-slate-400 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-500 group-hover:border-slate-300 dark:group-hover:border-slate-700"
            }`}
          >
            <Icon className="h-5 w-5 transition duration-300 group-hover:scale-110" />
          </div>
        </div>

        <div
          className={`flex-1 rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
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
            <h3 className="landing-title text-base font-bold sm:text-lg">{item.title}</h3>
          </div>
          <p className="landing-copy mt-1.5 text-xs leading-relaxed sm:text-sm">
            {item.description}
          </p>
        </div>
      </div>
    );
  });
}

function StaticJourneyRail() {
  return (
    <div className="relative space-y-6 lg:col-span-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 left-6 top-6 w-[2px] -translate-x-1/2"
      >
        <div className="h-full w-full rounded-full bg-amber-500/80" />
      </div>
      <JourneySteps activeStep={landingFlowSteps.length - 1} />
    </div>
  );
}

function AnimatedJourneyRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 75%", "end 55%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
  });

  const beamHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const beadOpacity = useTransform(smoothProgress, [0, 0.04, 0.94, 1.0], [0, 1, 1, 0]);

  useEffect(() => {
    return smoothProgress.on("change", (progress) => {
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
  }, [smoothProgress]);

  return (
    <div ref={railRef} className="relative space-y-6 lg:col-span-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 left-6 top-6 w-[2px] -translate-x-1/2"
      >
        <div className="h-full w-full rounded-full bg-slate-200/80 dark:bg-slate-800" />
        <motion.div
          style={{ height: beamHeight }}
          className="absolute left-0 top-0 w-full rounded-full bg-gradient-to-b from-amber-500 via-amber-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.65)]"
        >
          <motion.span
            style={{ opacity: beadOpacity }}
            className="absolute bottom-0 left-1/2 h-3.5 w-3.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b] ring-2 ring-white dark:ring-slate-900"
          />
        </motion.div>
      </div>
      <JourneySteps activeStep={activeStep} />
    </div>
  );
}

export default function HowItWorksSection() {
  const isDesktopViewport = useLandingMediaQuery(LANDING_DESKTOP_QUERY);
  const prefersReducedMotion = useLandingMediaQuery(LANDING_REDUCED_MOTION_QUERY);
  const shouldAnimateRail = isDesktopViewport && !prefersReducedMotion;

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
          
          {/* Mobile stays static; only desktop mounts the continuous scroll animation. */}
          {shouldAnimateRail ? <AnimatedJourneyRail /> : <StaticJourneyRail />}

          {/* Recorded gameplay uses the same StoryClozeGame component as the app. */}
          <div className="lg:col-span-5">
            <figure className="landing-product-panel overflow-hidden">
              <video
                className="aspect-video w-full object-contain"
                controls
                loop
                muted
                playsInline
                preload="none"
                poster="/media/story-cloze-poster.jpg?v=2"
                aria-label="Video minh họa kéo thả ba từ và kiểm tra đáp án Story Cloze"
                aria-describedby="story-cloze-video-caption"
              >
                <source src="/media/story-cloze-demo.mp4?v=2" type="video/mp4" />
                <source src="/media/story-cloze-demo.webm?v=2" type="video/webm" />
                Trình duyệt của bạn không hỗ trợ video. <a href="/media/story-cloze-demo.mp4?v=2">Tải video Story Cloze</a>.
              </video>
              <figcaption id="story-cloze-video-caption" className="p-6">
                <span className="landing-label landing-brand-kicker">
                  Story Cloze · Kéo thả &amp; kiểm tra
                </span>
                <h3 className="landing-title mt-3 font-[var(--font-display)] text-2xl font-bold">
                  Từ vựng tìm đúng chỗ trong câu chuyện.
                </h3>
                <p className="landing-copy mt-2 text-sm leading-relaxed">
                  Kéo từ vào từng ô trống, theo dõi tiến độ và kiểm tra đáp án để hoàn thành câu chuyện.
                </p>
                <p className="landing-copy mt-3 text-xs">
                  Bản quay từ giao diện game với câu chuyện mẫu. Bấm phát để xem, hoặc mở toàn màn hình để theo dõi rõ hơn.
                </p>
              </figcaption>
            </figure>
          </div>

        </div>
      </div>
    </AnimatedSection>
  );
}
