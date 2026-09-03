"use client";
// Living interactive demo component featuring a 3D-tilt Flashcard and a playable Story Cloze puzzle.

import { useState } from "react";
import { Volume2, RotateCw, CheckCircle2, Trophy, Flame, Play, Image as ImageIcon } from "lucide-react";
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
    <section id="interactive-demo" className="scroll-mt-24 py-10">
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl text-center md:text-left space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
              CHƯƠNG 02 &mdash; TRẢI NGHIỆM TƯƠNG TÁC
            </p>
            <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Học thử ngay mà không cần tạo tài khoản.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Nhấp vào thẻ để lật mặt, nghe phát âm giọng Mỹ và thử sức với câu đố Story Cloze bên dưới.
            </p>
          </div>

          {/* Optional Media Mode Toggle (Cho phép User bật/tắt placeholder ảnh/video bất cứ lúc nào) */}
          <button
            type="button"
            onClick={() => setShowMediaPlaceholder(!showMediaPlaceholder)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700"
          >
            {showMediaPlaceholder ? (
              <>
                <Play className="h-3.5 w-3.5 text-amber-500" />
                <span>Xem bản tương tác Live</span>
              </>
            ) : (
              <>
                <ImageIcon className="h-3.5 w-3.5 text-sky-500" />
                <span>Khung gắn Video/Ảnh Demo</span>
              </>
            )}
          </button>
        </div>

        {/* Conditional Rendering: Media Placeholder OR Interactive Demo */}
        {showMediaPlaceholder ? (
          /* Placeholder Box sẵn sàng cho Video / Screenshot sau này của User */
          <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-slate-100/70 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50 sm:p-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <Play className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              Khu vực hiển thị Video / Gameplay Screenshot
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              Bạn có thể dễ dàng nhúng video MP4/WebM hoặc file ảnh chụp màn hình ứng dụng tại đây bất cứ lúc nào khi đã chuẩn bị xong.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowMediaPlaceholder(false)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
              >
                Quay lại Demo Tương tác Sống
              </button>
            </div>
          </div>
        ) : (
          /* 2 Interactive Modules: 3D Flashcard + Mini Story Cloze */
          <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
            
            {/* Left Box: 3D Flippable Flashcard (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/80 dark:shadow-slate-950/50">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-300">
                  Topic: {currentWord.topic}
                </span>
                <span className="text-xs font-medium text-slate-400">
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
                      : "border-slate-200 bg-slate-50/70 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700"
                  }`}
                >
                  {/* Front Face: English word & Pronunciation */}
                  <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <span>{currentWord.type}</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">{currentWord.ipa}</span>
                    </div>

                    <h3 className="font-[var(--font-display)] text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {currentWord.word}
                    </h3>

                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Bấm vào thẻ để xem nghĩa & ví dụ
                    </p>
                  </div>

                  {/* Back Face: Vietnamese meaning & Example */}
                  <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-center p-6 text-left">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Giải nghĩa
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
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
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handlePronounce}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  aria-label="Phát âm từ vựng"
                >
                  <Volume2 className="h-4 w-4 text-emerald-500" />
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
            <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-6 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:from-slate-900/90 dark:to-slate-950/80 dark:shadow-slate-950/50">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                      <Trophy className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Minigame Độc Quyền: Story Cloze
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <Flame className="h-3.5 w-3.5 fill-amber-500" /> +50 XP
                    </span>
                  </div>
                </div>

                <h4 className="font-[var(--font-display)] text-lg font-bold text-slate-900 dark:text-white">
                  Chọn từ chính xác để hoàn tất câu chuyện:
                </h4>

                {/* Sentence with Gap */}
                <div className="my-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
                  <p className="text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
                    &ldquo;Last summer, our team embarked on a thrilling{" "}
                    <span
                      className={`inline-block min-w-[120px] rounded-lg border-2 px-3 py-1 text-center font-bold transition-all duration-300 ${
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
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                {clozeSolved ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                          Chính xác! Bạn nhận được +50 XP & 10 Gems.
                        </p>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
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
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>💡 Gợi ý: Từ vựng vừa xuất hiện trên thẻ Flashcard bên trái.</span>
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
