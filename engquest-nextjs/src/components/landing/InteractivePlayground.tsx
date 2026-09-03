"use client";
// Living interactive demo component featuring a 3D-tilt Flashcard and a playable Story Cloze puzzle.

import { useState } from "react";
import { Volume2, RotateCw, CheckCircle2, Trophy, Flame, Play, Image as ImageIcon, Lightbulb } from "lucide-react";
import confetti from "canvas-confetti";

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

export default function InteractivePlayground({ onOpenAuth }: { onOpenAuth: () => void }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [clozeSolved, setClozeSolved] = useState(false);
  const [showMediaPlaceholder, setShowMediaPlaceholder] = useState(false);

  const currentWord = SAMPLE_WORDS[currentWordIndex];

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
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
        particleCount: 50,
        spread: 60,
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

  return (
    <section id="interactive-demo" className="landing-section landing-section--raised scroll-mt-24 py-16 sm:py-20">
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl text-center md:text-left space-y-2">
            <p className="landing-label landing-kicker">
              CHƯƠNG 02 &mdash; TRẢI NGHIỆM TƯƠNG TÁC
            </p>
            <h2 className="landing-title font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
              Học thử ngay mà không cần tạo tài khoản.
            </h2>
            <p className="landing-copy text-sm sm:text-base">
              Nhấp vào thẻ để lật mặt, nghe phát âm giọng Mỹ và thử sức với câu đố Story Cloze bên dưới.
            </p>
          </div>

          {/* Optional Media Mode Toggle (Cho phép User bật/tắt placeholder ảnh/video bất cứ lúc nào) */}
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

        {/* Conditional Rendering: Media Placeholder OR Interactive Demo */}
        {showMediaPlaceholder ? (
          /* Placeholder Box sẵn sàng cho Video / Screenshot sau này của User */
          <div className="landing-media-placeholder relative overflow-hidden p-8 text-center sm:p-14">
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
          /* 2 Interactive Modules: 3D Flashcard + Mini Story Cloze */
          <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
            
            {/* Left Box: 3D Flippable Flashcard (5 cols) */}
            <div className="landing-product-panel lg:col-span-5 flex flex-col justify-between p-6">
              <div className="flex items-center justify-between">
                <span className="landing-product-panel--quiet landing-copy px-3 py-1 text-xs font-semibold">
                  Topic: {currentWord.topic}
                </span>
                <span className="landing-label text-xs font-medium tabular-nums">
                  Từ {currentWordIndex + 1} / {SAMPLE_WORDS.length}
                </span>
              </div>

              {/* 3D Perspective Flip Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="perspective-1000 my-6 h-64 w-full cursor-pointer select-none"
              >
                <div
                  className={`relative h-full w-full rounded-2xl border transition-transform duration-500 transform-style-3d ${
                    isFlipped
                      ? "rotate-y-180 border-amber-500/40 bg-amber-50/40 dark:border-amber-400/20 dark:bg-amber-500/5"
                      : "landing-product-panel--quiet"
                  }`}
                >
                  {/* Front Face: English word & Pronunciation */}
                  <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <span>{currentWord.type}</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">{currentWord.ipa}</span>
                    </div>

                    <h3 className="landing-title font-[var(--font-display)] text-5xl font-bold italic tracking-tight">
                      {currentWord.word}
                    </h3>

                    <p className="landing-label mt-4 text-xs font-semibold uppercase tracking-wider">
                      Bấm vào thẻ để xem nghĩa & ví dụ
                    </p>
                  </div>

                  {/* Back Face: Vietnamese meaning & Example */}
                  <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-center p-6 text-left">
                    <p className="landing-accent-text text-xs font-bold uppercase tracking-wider">
                      Giải nghĩa
                    </p>
                    <p className="landing-title mt-1 text-base font-semibold">
                      {currentWord.meaning}
                    </p>

                    <div className="mt-4 rounded-xl border border-black/5 bg-black/[0.03] p-3 dark:border-white/5 dark:bg-white/[0.03]">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Ví dụ ngữ cảnh:</p>
                      <p className="mt-1 text-xs italic text-slate-700 dark:text-slate-300">
                        &ldquo;{currentWord.example}&rdquo;
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        ({currentWord.exampleMeaning})
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Controls */}
              <div className="flex items-center justify-between border-t border-black/10 pt-3 dark:border-white/10">
                <button
                  type="button"
                  onClick={handlePronounce}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  aria-label="Phát âm từ vựng"
                >
                  <Volume2 className="landing-accent-text h-4 w-4" />
                  <span>Phát âm</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    <span>{isFlipped ? "Mặt trước" : "Lật mặt sau"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextWord}
                    className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  >
                    Từ tiếp theo →
                  </button>
                </div>
              </div>
            </div>

            {/* Right Box: Mini Story Cloze Game (7 cols) */}
            <div className="landing-product-panel lg:col-span-7 flex flex-col justify-between p-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="landing-accent-text flex h-7 w-7 items-center justify-center">
                      <Trophy className="h-4 w-4" />
                    </span>
                    <span className="landing-copy text-xs font-bold uppercase tracking-wider">
                      Minigame Độc Quyền: Story Cloze
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="landing-accent-text inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold">
                      <Flame className="h-3.5 w-3.5" /> +50 XP
                    </span>
                  </div>
                </div>

                <h4 className="landing-title font-[var(--font-display)] text-2xl font-bold">
                  Chọn từ chính xác để hoàn tất câu chuyện:
                </h4>

                {/* Sentence with Gap */}
                <div className="landing-product-panel--quiet my-6 p-5">
                  <p className="landing-title text-base leading-relaxed sm:text-lg">
                    &ldquo;Last summer, our team embarked on a thrilling{" "}
                    <span
                      className={`landing-cloze-gap inline-block rounded-lg border-2 px-3 py-1 text-center font-bold transition-all duration-300 ${
                        clozeSolved
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : selectedAnswer && !clozeSolved
                          ? "border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-500/20 dark:text-red-300"
                          : "border-dashed border-amber-400 bg-amber-50/50 text-amber-700 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-300"
                      }`}
                    >
                      {selectedAnswer ?? "[ ? ]"}
                    </span>{" "}
                    through the rugged highlands, discovering untouched villages along the way.&rdquo;
                  </p>
                </div>

                {/* Word Options */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Nhấp vào đáp án bạn cho là chính xác:
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {["suitcase", "adventure", "schedule"].map((choice) => {
                      const isSelected = selectedAnswer === choice;
                      const isCorrect = choice === "adventure";

                      return (
                        <button
                          key={choice}
                          type="button"
                          onClick={() => handleSelectAnswer(choice)}
                          disabled={clozeSolved}
                          className={`rounded-xl border py-3 px-4 text-sm font-bold transition duration-200 active:scale-95 ${
                            isSelected && isCorrect
                              ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                              : isSelected && !isCorrect
                              ? "border-red-500 bg-red-500 text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50/50 hover:text-amber-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-amber-500 dark:hover:bg-amber-500/10"
                          } ${clozeSolved && !isSelected ? "opacity-50" : ""}`}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Result & Auth Teaser */}
              <div className="mt-6 border-t border-black/10 pt-4 dark:border-white/10">
                {clozeSolved ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                          Chính xác! Bạn nhận được +50 XP & 10 Gems.
                        </p>
                        <p className="landing-micro text-emerald-700 dark:text-emerald-400">
                          Tạo tài khoản để ghi nhận kết quả này vào hồ sơ cá nhân.
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
                  <div className="landing-copy flex items-center justify-between gap-3 text-xs">
                    <span className="flex items-center gap-2">
                      <Lightbulb className="landing-accent-text h-4 w-4 shrink-0" />
                      Gợi ý: Từ vựng vừa xuất hiện trên thẻ Flashcard bên trái.
                    </span>
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
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
