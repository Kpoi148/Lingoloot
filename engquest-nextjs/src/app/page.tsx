"use client";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, PenLine, Sparkles, Star, X } from "lucide-react";
import AuthTabs from "@/components/auth/AuthTabs";
import FlashcardMockup from "@/components/landing/FlashcardMockup";
import ThemeToggle from "@/components/common/ThemeToggle";
import { Manrope, Space_Grotesk } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

type NavbarProps = {
  onNavigate: (id: string) => void;
};

function Navbar({ onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <div className="sticky top-0 z-40 w-full">
      <div className="mx-auto w-full max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`mt-4 flex items-center justify-between rounded-full border px-4 py-3 transition duration-300 sm:px-6 ${isScrolled
            ? "border-white/60 bg-white/75 shadow-lg shadow-slate-200/70 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-slate-950/40"
            : "border-transparent bg-white/0 dark:border-transparent dark:bg-transparent"
            }`}
        >
          <button
            type="button"
            onClick={() => handleNavClick("hero")}
            className="font-[var(--font-display)] text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100"
          >
            LingoLoot
          </button>

          <div className="hidden items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300 sm:flex">
            <button
              type="button"
              onClick={() => handleNavClick("features")}
              className="transition hover:text-slate-900 dark:hover:text-white"
            >
              Tính năng
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("how-it-works")}
              className="transition hover:text-slate-900 dark:hover:text-white"
            >
              Cách học
            </button>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => handleNavClick("register")}
              className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:shadow-slate-950/40 dark:hover:bg-slate-100 sm:block"
            >
              Bắt đầu ngay
            </button>
            {/* Hamburger Menu Button - Mobile Only */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 sm:hidden"
              aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-2 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 p-4 shadow-xl backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/95 sm:hidden"
            >
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick("features")}
                  className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Tính năng
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick("how-it-works")}
                  className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cách học
                </button>
                <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />
                <button
                  type="button"
                  onClick={() => handleNavClick("register")}
                  className="rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:shadow-slate-950/40 dark:hover:bg-slate-100"
                >
                  Bắt đầu ngay
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function HomePage() {
  const handleNavigate = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.18 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const testimonials = [
    "Học từ vựng chưa bao giờ nhàn thế này!",
    "AI thông minh quá, lấy ví dụ rất chuẩn.",
    "Bài quiz bám sát từ mình học nên tiến bộ nhanh.",
  ];
  const currentYear = new Date().getFullYear();

  return (
    <main
      className={`${manrope.variable} ${spaceGrotesk.variable} relative min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 font-[var(--font-body)] text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl animate-pulse dark:bg-amber-500/10" />
        <div
          className="absolute bottom-0 -left-28 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl animate-pulse dark:bg-sky-500/10"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <Navbar onNavigate={handleNavigate} />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-14 pt-24 lg:flex-row lg:items-start lg:gap-8 lg:pt-16">
        <section id="hero" className="flex-1 space-y-6 scroll-mt-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-sm dark:bg-white dark:text-slate-900">
            LingoLoot
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 dark:bg-emerald-400" />
          </span>
          <div className="space-y-4">
            <h1 className="font-[var(--font-display)] text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
              Vốn từ vựng
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-lg">
              Nền tảng học tập tối giản giúp bạn{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                tạo Flashcard tự động bằng AI
              </span>
              , luyện phát âm chuẩn IPA và{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                ôn tập qua Quiz thông minh
              </span>
              .
            </p>
          </div>
          <div
            id="features"
            className="grid max-w-lg scroll-mt-28 grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">
                AI Automation
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                Tự động điền nghĩa, phiên âm IPA và ví dụ ngữ cảnh chuẩn xác chỉ với một từ khóa.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">
                Smart Review
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                Hệ thống tự tạo bài Quiz trắc nghiệm đa dạng dựa trên chính danh sách từ vựng của bạn.
              </p>
            </div>
          </div>

        </section>

        {/* Flashcard Mockup - Center on desktop */}
        <FlashcardMockup />

        <section className="flex w-full flex-1 flex-col gap-6 lg:max-w-md">
          <AuthTabs />
        </section>
      </div>

      <motion.section
        id="how-it-works"
        className="relative mx-auto w-full max-w-6xl px-4 pb-20 scroll-mt-28"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-slate-950/40 sm:p-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
              Vì sao LingoLoot?
            </p>
            <h2 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Đừng tốn thời gian chép từ vựng thủ công nữa!
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              Học nhanh hơn, nhàn hạ hơn, vui vẻ hơn khi mọi thao tác nhàm chán đã
              có AI xử lý giúp bạn.
            </p>
          </div>

          <motion.div
            className="mt-8 grid gap-6 lg:grid-cols-2"
            variants={gridVariants}
          >
            <motion.div
              variants={cardVariants}
              className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-400"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  <PenLine className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                    Cách cũ
                  </p>
                  <p className="mt-3 text-lg font-semibold text-slate-700 dark:text-slate-200">
                    Tra từ điển, chép tay, mau quên.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-6 text-slate-700 shadow-2xl shadow-emerald-200/60 dark:border-emerald-500/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 dark:text-slate-200 dark:shadow-emerald-500/10"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-200/70 blur-3xl dark:bg-emerald-500/20" />
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-300/60">
                  <motion.span
                    className="inline-flex"
                    animate={{ rotate: [0, 8, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </motion.span>
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-400">
                    Cách LingoLoot
                  </p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Gõ 1 từ, AI lo phần còn lại (IPA, Nghĩa, Ví dụ) trong tích
                    tắc.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="gamification"
        className="relative mx-auto w-full max-w-6xl px-4 pb-20"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
            Gamification
          </p>
          <h2 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Biến việc học thành trò chơi.
          </h2>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Từ câu chuyện, streak đến quiz cá nhân hoá, mỗi ngày học đều có mục tiêu rõ
            ràng để bạn giữ hứng thú.
          </p>
        </div>

        <motion.div
          className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-3"
          variants={gridVariants}
        >
          <motion.div
            variants={cardVariants}
            className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-xl shadow-slate-200/60 dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-slate-950/40 md:col-span-2 lg:col-span-7 lg:row-span-3"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-400">
                  Story Mode
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  Học từ trong ngữ cảnh
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                Live
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-5 dark:border-slate-800/80 dark:bg-slate-900/80">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Kéo thả từ vào khoảng trống để hoàn thành câu chuyện.
              </p>
              <div className="rounded-xl bg-white/90 p-4 shadow-inner shadow-slate-200/70 dark:bg-slate-950/70 dark:shadow-slate-950/40">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  I went on an{" "}
                  <span className="inline-flex items-center rounded-full border border-dashed border-emerald-300/80 px-4 py-1 text-xs font-semibold text-emerald-600 dark:border-emerald-500/50 dark:text-emerald-300">
                    ___
                  </span>{" "}
                  to the mountains.
                </p>
                <div className="mt-4 flex items-center gap-3 text-sm">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                    adventure
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">→</span>
                  <span className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs font-semibold text-slate-400 dark:border-slate-700 dark:text-slate-500">
                    thả vào
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="rounded-3xl border border-amber-200/70 bg-amber-50/80 p-6 shadow-lg shadow-amber-100/70 dark:border-amber-500/30 dark:bg-amber-500/10 dark:shadow-amber-500/10 lg:col-span-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600 dark:text-amber-400">
                Smart Streak
              </p>
              <span className="text-3xl">🔥</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Giữ lửa mỗi ngày
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Tạo thói quen học tập bằng chuỗi ngày liên tục.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-amber-600 dark:bg-slate-900/80 dark:text-amber-300">
                Day 7
              </div>
              <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-amber-600 dark:bg-slate-900/80 dark:text-amber-300">
                +10 XP
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="rounded-3xl border border-sky-200/70 bg-sky-50/80 p-6 shadow-lg shadow-sky-100/70 dark:border-sky-500/30 dark:bg-sky-500/10 dark:shadow-sky-500/10 lg:col-span-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600 dark:text-sky-400">
                Personalized Quiz
              </p>
              <span className="text-3xl">🎯</span>
            </div>
            <p className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Bài tập sinh ra từ chính từ vựng của bạn
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Luyện tập đúng những gì bạn vừa học để nhớ sâu hơn.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span className="rounded-full bg-white/90 px-3 py-1 dark:bg-slate-900/80">
                Quiz 1
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1 dark:bg-slate-900/80">
                Quiz 2
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1 dark:bg-slate-900/80">
                Quiz 3
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="rounded-3xl border border-emerald-200/70 bg-emerald-50/80 p-6 shadow-lg shadow-emerald-100/70 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:shadow-emerald-500/10 lg:col-span-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-400">
                Mastery Tracking
              </p>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                0% → 100%
              </span>
            </div>
            <p className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Theo dõi tiến độ rõ ràng
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Biết mình đang ở đâu để giữ nhịp học ổn định.
            </p>
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>0%</span>
                <span>100%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-emerald-100 dark:bg-emerald-900/60">
                <div className="h-2 w-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 dark:from-emerald-400 dark:to-amber-300" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        id="testimonials"
        className="relative mx-auto w-full max-w-6xl px-4 pb-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Trusted by learners
            </p>
            <h2 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Người học nói gì về LingoLoot?
            </h2>
          </div>
          <div className="rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-300">
            5.0/5 trung bình
          </div>
        </div>

        <motion.div
          className="mt-8 grid gap-6 md:grid-cols-3"
          variants={gridVariants}
        >
          {testimonials.map((quote) => (
            <motion.div
              key={quote}
              variants={cardVariants}
              className="rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-xl shadow-slate-200/60 dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-slate-950/40"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={`${quote}-${index}`}
                    className="h-4 w-4 text-amber-400 dark:text-amber-300"
                    fill="currentColor"
                  />
                ))}
              </div>
              <p className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
                "{quote}"
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                Người học LingoLoot
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        id="cta"
        className="relative mx-auto w-full max-w-6xl px-4 pb-28"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-12 text-white shadow-2xl shadow-indigo-500/30 dark:from-indigo-500 dark:to-sky-500 dark:shadow-indigo-500/20 sm:px-10 sm:py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                Sẵn sàng bắt đầu?
              </p>
              <h2 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
                Sẵn sàng bứt phá vốn từ vựng?
              </h2>
              <p className="max-w-xl text-base text-white/85 sm:text-lg">
                Tạo tài khoản miễn phí và để LingoLoot biến việc học trở nên nhẹ nhàng hơn.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleNavigate("hero")}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-indigo-700 shadow-lg shadow-indigo-900/20 transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-50 dark:bg-white dark:text-indigo-700 dark:hover:bg-indigo-50 sm:px-8 sm:py-4 sm:text-lg"
            >
              Tạo tài khoản miễn phí
            </button>
          </div>
        </div>
      </motion.section>

      <motion.footer
        className="relative mx-auto w-full max-w-6xl px-4 pb-12"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-6 py-10 text-slate-100 shadow-2xl shadow-slate-900/40 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -left-12 -top-16 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-8 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <p className="font-[var(--font-display)] text-2xl font-semibold tracking-tight">
                LingoLoot
              </p>
              <p className="text-sm text-slate-300">
                Học nhanh, nhàn hạ, vui vẻ.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Khám phá
              </p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-slate-200">
                <button
                  type="button"
                  onClick={() => handleNavigate("features")}
                  className="text-left transition hover:text-white"
                >
                  Tính năng
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("how-it-works")}
                  className="text-left transition hover:text-white"
                >
                  Cách học
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("register")}
                  className="text-left transition hover:text-white"
                >
                  Đăng ký
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Liên hệ
              </p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-slate-200">
                <a
                  href="mailto:support@lingoloot.com"
                  className="transition hover:text-white"
                >
                  support@lingoloot.com
                </a>
                <a
                  href="https://github.com/Kpoi148"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>© {currentYear} LingoLoot. All rights reserved.</span>
            <span>Thiết kế cho người học tiếng Anh.</span>
          </div>
        </div>
      </motion.footer>
    </main>
  );
}
