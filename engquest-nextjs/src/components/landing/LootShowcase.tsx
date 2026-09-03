"use client";
// Showcase component for cosmetic AI-generated animated SVG frames and Loot rewards.

import { useState } from "react";
import { Sparkles, Shield, Zap, ArrowRight } from "lucide-react";
import TechFrame from "@/components/shop/frames/TechFrame";
import MysticFrame from "@/components/shop/frames/MysticFrame";
import HexFrame from "@/components/shop/frames/HexFrame";

type ShowcaseItem = {
  id: string;
  name: string;
  tier: "Common" | "Rare" | "Legendary";
  gemCost: number;
  description: string;
  frameType: "hex" | "tech" | "mystic";
  badgeColor: string;
  borderColor: string;
  tag: string;
};

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "hex",
    name: "Hex Shield V1",
    tier: "Common",
    gemCost: 50,
    description: "Khung lục giác tối giản với đường cắt kim loại thanh thoát.",
    frameType: "hex",
    badgeColor: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700",
    borderColor: "hover:border-slate-400 dark:hover:border-slate-600",
    tag: "Khởi đầu",
  },
  {
    id: "tech",
    name: "Cyber Pulse Nexus",
    tier: "Rare",
    gemCost: 250,
    description: "Mạch điện tử ma trận màu xanh ngọc lam xoay chuyển vô cực.",
    frameType: "tech",
    badgeColor: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-800",
    borderColor: "hover:border-cyan-400 dark:hover:border-cyan-500",
    tag: "Chuyển động",
  },
  {
    id: "mystic",
    name: "Astral Rune Overlord",
    tier: "Legendary",
    gemCost: 1000,
    description: "Cổ ngữ thần bí phát sáng hào quang tím ma thuật đỉnh cao do AI vẽ.",
    frameType: "mystic",
    badgeColor: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800",
    borderColor: "hover:border-purple-500 dark:hover:border-purple-400",
    tag: "Cực hiếm",
  },
];

export default function LootShowcase({ onOpenAuth }: { onOpenAuth: () => void }) {
  const [activeItem, setActiveItem] = useState<string>("mystic");

  return (
    <section id="vault" className="scroll-mt-24 py-16">
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            CHƯƠNG 04 &mdash; KHO BÁU & KHUNG SVG HOẠT HỌA
          </p>
          <h2 className="font-[var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Kho báu Loot & Khung Avatar Hoạt Họa SVG
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Mỗi điểm XP và Gem bạn kiếm được từ bài học có thể đổi thành các khung avatar động độc nhất vô nhị — sinh ra từ Google Gemini AI, hoạt họa bằng mã SVG thuần khiết.
          </p>
        </div>

        {/* 3 Tier Showcase Pedestals */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SHOWCASE_ITEMS.map((item) => {
            const isSelected = activeItem === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`group relative flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-lg transition-all duration-300 cursor-pointer dark:bg-slate-900/80 ${
                  isSelected
                    ? "border-amber-500 shadow-xl shadow-amber-500/10 scale-[1.02] dark:border-amber-400"
                    : "border-slate-200/80 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20"
                } ${item.borderColor}`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${item.badgeColor}`}>
                    {item.tier}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    {item.gemCost} Gems
                  </span>
                </div>

                {/* Animated Avatar Center Display */}
                <div className="my-8 flex items-center justify-center">
                  <div className="relative h-36 w-36 transition duration-300 group-hover:scale-105">
                    {item.frameType === "hex" && (
                      <HexFrame className="h-full w-full" avatarUrl="/logo.png" />
                    )}
                    {item.frameType === "tech" && (
                      <TechFrame className="h-full w-full" avatarUrl="/logo.png" />
                    )}
                    {item.frameType === "mystic" && (
                      <MysticFrame className="h-full w-full" avatarUrl="/logo.png" />
                    )}
                  </div>
                </div>

                {/* Item Details */}
                <div className="space-y-2 text-center">
                  <h3 className="font-[var(--font-display)] text-xl font-bold text-slate-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAuth();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400"
                  >
                    <span>Mở khóa trong Shop</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Highlights beneath */}
        <div className="mt-10 rounded-2xl border border-slate-200/60 bg-slate-50/70 p-5 dark:border-white/5 dark:bg-slate-950/60">
          <div className="grid gap-4 sm:grid-cols-3 text-center sm:text-left">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">SVG Vector Thuần Khiết</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sắc nét tuyệt đối trên mọi màn hình Retina, không vỡ hạt, tải siêu tốc.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Zap className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Hoạt Họa Vô Cực (CSS Keyframes)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Các luồng sáng xoay vòng, nhấp nháy pulse tạo phong cách game đẳng cấp.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Shield className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tích Lũy & Tùy Biến Hồ Sơ</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Trang bị ngay vào trang Profile của bạn để khoe thành tích với cộng đồng.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
