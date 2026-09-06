"use client";
// Sticky Split-Screen with Sequenced Trigger: Left side runs entrance & morphing effect first, followed by Right side.

import { useEffect, useRef, useState } from "react";
import {
  Volume2,
  RotateCw,
  CheckCircle2,
  Trophy,
  Play,
  Image as ImageIcon,
  BookOpenText,
  BrainCircuit,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import TechFrame from "@/components/shop/frames/TechFrame";

type VocabCard = {
  word: string;
  ipa: string;
  type: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
  topic: string;
};

const SAMPLE_WORDS: VocabCard[] = [
  {
    word: "adventure",
    ipa: "/ədˈven.tʃər/",
    type: "noun",
    meaning: "Chuyến phiêu lưu, trải nghiệm mạo hiểm đầy hào hứng",
    example: "Every new lesson becomes an adventure when unlocked.",
    exampleMeaning: "Mỗi bài học mới biến thành một chuyến phiêu lưu khi được mở khóa.",
    topic: "Travel & Discovery",
  },
  {
    word: "itinerary",
    ipa: "/aɪˈtɪn.ər.ər.i/",
    type: "noun",
    meaning: "Lịch trình chi tiết của một chuyến đi hay kế hoạch",
    example: "Review your daily study itinerary to maintain your streak.",
    exampleMeaning: "Xem lại lịch trình học tập mỗi ngày để giữ vững chuỗi streak.",
    topic: "Planning",
  },
  {
    word: "breathtaking",
    ipa: "/ˈbreθˌteɪ.kɪŋ/",
    type: "adjective",
    meaning: "Đẹp nghẹt thở, ngoạn mục và vô cùng ấn tượng",
    example: "The view from the mountain peak was truly breathtaking.",
    exampleMeaning: "Khung cảnh nhìn từ đỉnh núi thực sự đẹp đến nghẹt thở.",
    topic: "Nature",
  },
];

const MILESTONES = [
  {
    step: "01",
    label: "Tiếp Nhận Từ Vựng",
    title: "Nạp từ trực quan & Phát âm bản xứ",
    icon: BookOpenText,
    description:
      "Không học vẹt danh sách từ khô khan. Thẻ Flashcard tương tác kết hợp phiên âm quốc tế IPA, giọng đọc chuẩn Mỹ và ví dụ thực tế giúp kích hoạt trí nhớ thị giác và thính giác đa giác quan.",
  },
  {
    step: "02",
    label: "Luyện Phản Xạ Ngữ Cảnh",
    title: "Khóa phản xạ qua Minigame Story Cloze",
    icon: BrainCircuit,
    description:
      "Chuyển hóa từ vựng thụ động thành phản xạ giao tiếp tự nhiên. Đọc hiểu đoạn văn ngữ cảnh do AI tạo lập và kéo thả từ vựng thích hợp vào câu chuyện để khắc sâu kiến thức vào trí nhớ dài hạn.",
  },
  {
    step: "03",
    label: "Chiến Lợi Phẩm & Vinh Danh",
    title: "Tích lũy Gems & Mở khóa Khung Avatar AI",
    icon: Trophy,
    description:
      "Biến mỗi giờ học thành một chuyến săn kho báu thực thụ. Hoàn thành nhiệm vụ để tích lũy đá quý Gems, giữ vững chuỗi lửa Streak và sở hữu các bộ khung avatar chuyển động SVG độc bản.",
  },
];

export default function InteractivePlayground({ onOpenAuth }: { onOpenAuth: () => void }) {
  // Sequenced state: Left console morphs first, Right milestone highlights second
  const [leftActiveStep, setLeftActiveStep] = useState<number>(0);
  const [rightActiveStep, setRightActiveStep] = useState<number>(0);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [clozeSolved, setClozeSolved] = useState(false);
  const [showMediaPlaceholder, setShowMediaPlaceholder] = useState(false);

  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pendingStepRef = useRef<number>(0);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentWord = SAMPLE_WORDS[currentWordIndex];

  // Sequenced transition: Left side runs its effect FIRST, then Right side runs after 420ms
  const triggerStepTransition = (newStep: number) => {
    if (newStep === pendingStepRef.current) return;
    pendingStepRef.current = newStep;

    // Nhịp 1: Bên trái (Console) đổi trạng thái và chạy animation biến đổi trước
    setLeftActiveStep(newStep);

    // Nhịp 2: Sau 420ms (khi bên trái đã hoàn tất 100% cả exit lẫn enter animation), bên phải mới kích hoạt hiệu ứng
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      setRightActiveStep(newStep);
    }, 420);
  };

  // Scroll Trigger Observer: Detects milestone in center viewport and triggers left-then-right sequence
  useEffect(() => {
    const handleScroll = () => {
      const centerY = window.innerHeight / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      milestoneRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - centerY);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      triggerStepTransition(closestIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  // Web Speech API for pronunciation
  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  // Play audio chime using Web Audio API
  const playRewardChime = () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext unavailable or blocked by policy
    }
  };

  const handleSelectAnswer = (ans: string) => {
    if (clozeSolved) return;
    setSelectedAnswer(ans);
    if (ans === "adventure") {
      setClozeSolved(true);
      playRewardChime();
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.7 },
      });
    }
  };

  const handleNextWord = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    setSelectedAnswer(null);
    setClozeSolved(false);
    setCurrentWordIndex((prev) => (prev + 1) % SAMPLE_WORDS.length);
  };

  const scrollToMilestone = (index: number) => {
    triggerStepTransition(index);
    const target = milestoneRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      id="interactive-demo"
      className="landing-section landing-section--raised scroll-mt-24 py-16 sm:py-24"
    >
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Global Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end border-b border-slate-200/80 pb-8 dark:border-slate-800">
          <div className="max-w-2xl text-center md:text-left space-y-2">
            <p className="landing-label landing-kicker">
              CHƯƠNG 02 &mdash; TRẢI NGHIỆM TƯƠNG TÁC
            </p>
            <h2 className="landing-title font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
              Học thử ngay mà không cần tạo tài khoản.
            </h2>
            <p className="landing-copy text-sm sm:text-base">
              Cuộn trang để theo dõi màn hình biến đổi tương ứng qua từng chặng, hoặc trực tiếp thao tác thử bên dưới.
            </p>
          </div>

          {/* Optional Media Mode Toggle */}
          <button
            type="button"
            onClick={() => setShowMediaPlaceholder(!showMediaPlaceholder)}
            className="landing-compact-action"
          >
            {showMediaPlaceholder ? (
              <>
                <Play className="landing-accent-text h-3.5 w-3.5" />
                <span>Xem bản tương tác Live</span>
              </>
            ) : (
              <>
                <ImageIcon className="landing-accent-text h-3.5 w-3.5" />
                <span>Khung gắn Video/Ảnh Demo</span>
              </>
            )}
          </button>
        </div>

        {/* Sticky Split-Screen Grid: Left Console (Sticky) + Right Milestones (Scrolls) */}
        {showMediaPlaceholder ? (
          <div className="landing-media-placeholder relative overflow-hidden p-8 text-center sm:p-14 rounded-3xl">
            <div className="landing-accent-text mx-auto flex h-16 w-16 items-center justify-center">
              <Play className="h-8 w-8" />
            </div>
            <h3 className="landing-title mt-4 font-[var(--font-display)] text-2xl font-bold">
              Khu vực hiển thị Video / Gameplay Screenshot
            </h3>
            <p className="landing-copy mx-auto mt-2 max-w-md text-sm">
              Bạn có thể dễ dàng nhúng video MP4/WebM hoặc file ảnh chụp màn hình ứng dụng tại đây bất cứ lúc nào khi đã chuẩn bị xong.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowMediaPlaceholder(false)}
                className="landing-button-primary"
              >
                Quay lại Demo Tương tác Sống
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            
            {/* ========================================================================= */}
            {/* CỘT TRÁI (GHIM CỐ ĐỊNH & CHẠY HIỆU ỨNG TRƯỚC): Live Device Console (7 cols) */}
            {/* ========================================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="lg:col-span-7 lg:sticky lg:top-24 z-20"
            >
              <div className="landing-product-panel overflow-hidden border border-slate-200/80 bg-white/95 shadow-xl dark:border-slate-800 dark:bg-slate-900/90 rounded-3xl">
                
                {/* Console Top Header Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-3 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="ml-2 text-xs font-mono font-medium text-slate-400 dark:text-slate-500">
                      lingoloot-console.app
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                      <span>CHẶNG 0{leftActiveStep + 1} / 03</span>
                    </span>
                  </div>
                </div>

                {/* Console Body: Dynamic Morphing Stage (BÊN TRÁI CHẠY TRƯỚC) */}
                <div className="p-6 sm:p-8 min-h-[420px] flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    
                    {/* STATE 0: 3D Flashcard & Native Audio */}
                    {leftActiveStep === 0 && (
                      <motion.div
                        key="step-0-flashcard"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex flex-col justify-between h-full"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="landing-product-panel--quiet px-3 py-1 text-xs font-semibold">
                              Topic: {currentWord.topic}
                            </span>
                            <span className="landing-label text-xs font-medium tabular-nums">
                              Từ {currentWordIndex + 1} / {SAMPLE_WORDS.length}
                            </span>
                          </div>

                          {/* 3D Flippable Flashcard */}
                          <div
                            onClick={() => setIsFlipped(!isFlipped)}
                            className="perspective-1000 my-6 h-60 w-full cursor-pointer select-none"
                          >
                            <div
                              className={`relative h-full w-full rounded-2xl border transition-transform duration-500 transform-style-3d ${
                                isFlipped
                                  ? "rotate-y-180 border-amber-500/40 bg-amber-50/40 dark:border-amber-400/20 dark:bg-amber-500/5"
                                  : "landing-product-panel--quiet"
                              }`}
                            >
                              {/* Front Face: English Word & IPA */}
                              <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                  <span>{currentWord.type}</span>
                                  <span>•</span>
                                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                                    {currentWord.ipa}
                                  </span>
                                </div>

                                <h3 className="landing-title font-[var(--font-display)] text-5xl font-bold italic tracking-tight">
                                  {currentWord.word}
                                </h3>

                                <p className="landing-label mt-4 text-xs font-semibold uppercase tracking-wider">
                                  Bấm vào thẻ để lật xem nghĩa & ví dụ
                                </p>
                              </div>

                              {/* Back Face: Vietnamese Meaning & Example */}
                              <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-center p-6 text-left">
                                <p className="landing-accent-text text-xs font-bold uppercase tracking-wider">
                                  Giải nghĩa
                                </p>
                                <p className="landing-title mt-1 text-lg font-bold">
                                  {currentWord.meaning}
                                </p>

                                <div className="mt-4 border-t border-black/5 pt-3 dark:border-white/5">
                                  <p className="landing-copy text-xs italic">
                                    &ldquo;{currentWord.example}&rdquo;
                                  </p>
                                  <p className="landing-micro mt-1 text-slate-500">
                                    {currentWord.exampleMeaning}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Flashcard Action Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handlePronounce}
                              className="landing-compact-action"
                              title="Nghe phát âm chuẩn"
                            >
                              <Volume2 className="h-4 w-4" />
                              <span>Phát âm</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsFlipped(!isFlipped);
                              }}
                              className="landing-compact-action"
                            >
                              <RotateCw className="h-3.5 w-3.5" />
                              <span>{isFlipped ? "Mặt trước" : "Lật mặt sau"}</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={handleNextWord}
                            className="landing-compact-action group"
                          >
                            <span>Từ tiếp theo</span>
                            <span className="transition-transform group-hover:translate-x-0.5">→</span>
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STATE 1: Playable Story Cloze Minigame */}
                    {leftActiveStep === 1 && (
                      <motion.div
                        key="step-1-cloze"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex flex-col justify-between h-full space-y-6"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="landing-accent-text flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                              <BrainCircuit className="h-4 w-4" />
                              <span>Minigame Phản Xạ Ngữ Cảnh</span>
                            </span>
                            <span className="landing-label text-xs font-bold text-amber-600 dark:text-amber-400">
                              +50 XP
                            </span>
                          </div>

                          {/* Interactive Story Cloze Card */}
                          <div className="landing-product-panel--quiet mt-5 rounded-2xl p-6">
                            <p className="landing-title text-base sm:text-lg leading-relaxed font-medium">
                              &ldquo;Every morning we set out on an unknown journey. For learners, unlocking each new word feels like embarking on a real{" "}
                              <span
                                className={`inline-block min-w-28 rounded-lg border-2 border-dashed px-3 py-0.5 text-center font-bold transition-all ${
                                  clozeSolved
                                    ? "border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-300"
                                    : selectedAnswer
                                    ? "border-red-400 bg-red-100 text-red-900 dark:bg-red-500/20 dark:text-red-300"
                                    : "border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-300"
                                }`}
                              >
                                {selectedAnswer || "..."}
                              </span>{" "}
                              across the universe.&rdquo;
                            </p>

                            {/* 3 Clickable Answer Pills */}
                            <div className="mt-6 flex flex-wrap items-center gap-2.5">
                              <span className="text-xs font-semibold text-slate-400 mr-1">
                                Chọn từ điền vào:
                              </span>
                              {["schedule", "adventure", "problem"].map((wordOption) => {
                                const isSelected = selectedAnswer === wordOption;
                                const isCorrect = wordOption === "adventure";

                                return (
                                  <button
                                    key={wordOption}
                                    type="button"
                                    disabled={clozeSolved}
                                    onClick={() => handleSelectAnswer(wordOption)}
                                    className={`rounded-xl border px-4 py-2 text-xs font-bold transition ${
                                      isSelected
                                        ? isCorrect
                                          ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                                          : "border-red-500 bg-red-500 text-white shadow-md shadow-red-500/25"
                                        : "border-slate-200 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                    }`}
                                  >
                                    {wordOption}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Result Box */}
                        <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                          {clozeSolved ? (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
                              <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <div>
                                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                                    Chính xác! Bạn nhận được +50 XP & 10 Gems.
                                  </p>
                                  <p className="landing-micro text-emerald-700 dark:text-emerald-400">
                                    Tạo tài khoản để lưu lại toàn bộ chiến lợi phẩm này.
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={onOpenAuth}
                                className="whitespace-nowrap rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700"
                              >
                                Lưu tiến độ ngay →
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span>Gợi ý: Từ vựng vừa xuất hiện trên thẻ Flashcard ở chặng 1.</span>
                              {selectedAnswer && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedAnswer(null);
                                    setClozeSolved(false);
                                  }}
                                  className="font-medium underline hover:text-slate-800 dark:hover:text-slate-200"
                                >
                                  Đặt lại
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* STATE 2: Loot Claim & Mastery Celebration */}
                    {leftActiveStep === 2 && (
                      <motion.div
                        key="step-2-loot"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex flex-col justify-between h-full space-y-6"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="landing-accent-text flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                              <Sparkles className="h-4 w-4" />
                              <span>Kho Chiến Lợi Phẩm Hoàn Thành</span>
                            </span>
                            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                              Sẵn sàng nhận thưởng
                            </span>
                          </div>

                          {/* Unlocked Reward Card */}
                          <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent p-6 text-center">
                            {/* Animated SVG Tech Frame Preview */}
                            <div className="relative my-2 flex h-28 w-28 items-center justify-center">
                              <TechFrame className="h-28 w-28" />
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xl shadow-lg">
                                LL
                              </div>
                            </div>

                            <h4 className="landing-title mt-3 font-[var(--font-display)] text-xl font-bold">
                              Khung Cyber Pulse Nexus (Rare)
                            </h4>
                            <p className="landing-copy mt-1 max-w-xs text-xs">
                              Mạch điện tử xoay chuyển vô cực do Gemini AI thiết kế riêng cho người học xuất sắc.
                            </p>
                          </div>

                          {/* 3 Metric Pills Earned */}
                          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 text-center">
                            <div className="landing-product-panel--quiet rounded-xl p-2.5">
                              <span className="text-xs text-slate-400">XP</span>
                              <p className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                                +50 XP
                              </p>
                            </div>
                            <div className="landing-product-panel--quiet rounded-xl p-2.5">
                              <span className="text-xs text-slate-400">Gems</span>
                              <p className="text-sm sm:text-base font-extrabold text-amber-600 dark:text-amber-400">
                                +10 Gems
                              </p>
                            </div>
                            <div className="landing-product-panel--quiet rounded-xl p-2.5">
                              <span className="text-xs text-slate-400">Streak</span>
                              <p className="text-sm sm:text-base font-extrabold text-orange-600 dark:text-orange-400">
                                +1 Ngày
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Call-to-action */}
                        <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={onOpenAuth}
                            className="landing-button-primary group w-full justify-center gap-2"
                          >
                            <span>Gia nhập ngay để lưu toàn bộ chiến lợi phẩm</span>
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

              </div>
            </motion.div>

            {/* ========================================================================= */}
            {/* CỘT PHẢI (CHẠY HIỆU ỨNG SAU BÊN TRÁI): 3 Thẻ Dẫn Dắt Milestones (5 cols)   */}
            {/* ========================================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
              className="space-y-16 sm:space-y-24 lg:col-span-5 py-4 lg:py-8"
            >
              {MILESTONES.map((m, idx) => {
                const Icon = m.icon;
                const isActive = rightActiveStep === idx;

                return (
                  <div
                    key={m.step}
                    ref={(el) => {
                      milestoneRefs.current[idx] = el;
                    }}
                    onClick={() => scrollToMilestone(idx)}
                    className={`group relative cursor-pointer rounded-3xl border p-6 sm:p-8 transition-all duration-500 ${
                      isActive
                        ? "border-amber-500/80 bg-white/95 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/20 dark:border-amber-400/80 dark:bg-slate-900/90"
                        : "border-slate-200/80 bg-white/50 opacity-50 hover:opacity-85 dark:border-slate-800 dark:bg-slate-900/40"
                    }`}
                  >
                    {/* Step Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 ${
                            isActive
                              ? "bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-105"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                            BƯỚC {m.step}
                          </span>
                          <h4 className="landing-title text-base sm:text-lg font-bold">
                            {m.label}
                          </h4>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-bold transition-all duration-300 ${
                          isActive
                            ? "text-amber-600 dark:text-amber-400 translate-x-0 opacity-100"
                            : "text-slate-400 -translate-x-1 opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        Đang xem →
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="landing-title mt-4 text-lg sm:text-xl font-bold">
                      {m.title}
                    </h3>
                    <p className="landing-copy mt-2 text-xs sm:text-sm leading-relaxed">
                      {m.description}
                    </p>

                    {/* Active Indicator Line (Chạy sau khi bên trái hoàn tất đổi màn hình) */}
                    <div className="mt-6 h-1 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ease-out ${
                          isActive
                            ? "w-full bg-gradient-to-r from-amber-500 to-amber-400"
                            : "w-0"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </motion.div>

          </div>
        )}

      </div>
    </section>
  );
}
