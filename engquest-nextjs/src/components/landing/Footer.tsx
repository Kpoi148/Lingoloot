"use client";
// Landing footer with compact navigation and credits.

import BrandLogo from "@/components/common/BrandLogo";
import { AnimatedSection } from "@/components/common/AnimatedSection";
import { landingNavItems } from "@/components/landing/content";

type FooterProps = {
  onNavigate: (id: string) => void;
};

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <AnimatedSection className="relative mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#07090E] px-8 py-10 text-slate-100 shadow-xl sm:px-12 sm:py-12">
        <div className="relative grid gap-8 md:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,0.8fr))]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <BrandLogo
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl"
                  size={36}
                />
              </span>
              <div>
                <p className="font-[var(--font-display)] text-2xl font-extrabold tracking-tight">
                  LingoLoot
                </p>
                <p className="text-[11px] uppercase tracking-[0.25em] text-amber-500 font-bold">
                  Quest & Loot English
                </p>
              </div>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-slate-400">
              Nền tảng học tiếng Anh tương tác kết hợp cơ chế trò chơi hóa: từ vựng, flashcard 3D, quiz, story cloze và phần thưởng profile SVG độc quyền.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Khám phá
            </p>
            <div className="mt-4 flex flex-col gap-2.5 text-xs text-slate-300">
              {landingNavItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className="text-left transition hover:text-white"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Cộng đồng & Mã nguồn
            </p>
            <div className="mt-4 flex flex-col gap-2.5 text-xs text-slate-300">
              <a
                href="https://github.com/Kpoi148"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                GitHub Repository
              </a>
            </div>
          </div>
        </div>

        <div className="relative mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {currentYear} LingoLoot. Mọi quyền được bảo lưu.</span>
          <span>Được xây dựng với niềm đam mê học ngoại ngữ và gaming.</span>
        </div>
      </div>
    </AnimatedSection>
  );
}
