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
    badgeColor: "border-white/10 bg-white/5 text-slate-300",
    tag: "Khởi đầu",
  },
  {
    id: "tech",
    name: "Cyber Pulse Nexus",
    tier: "Rare",
    gemCost: 250,
    description: "Mạch điện tử ma trận màu xanh ngọc lam xoay chuyển vô cực.",
    frameType: "tech",
    badgeColor: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    tag: "Chuyển động",
  },
  {
    id: "mystic",
    name: "Astral Rune Overlord",
    tier: "Legendary",
    gemCost: 1000,
    description: "Cổ ngữ thần bí phát sáng hào quang tím ma thuật đỉnh cao do AI vẽ.",
    frameType: "mystic",
    badgeColor: "border-purple-400/30 bg-purple-400/10 text-purple-300",
    tag: "Cực hiếm",
  },
];

export default function LootShowcase({ onOpenAuth }: { onOpenAuth: () => void }) {
  const [activeItem, setActiveItem] = useState<string>("mystic");

  return (
    <section id="vault" className="landing-section landing-section--ink scroll-mt-24 py-16 sm:py-24">
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <p className="landing-inverted-label landing-kicker">
            CHƯƠNG 04 &mdash; KHO BÁU & KHUNG SVG HOẠT HỌA
          </p>
          <h2 className="landing-inverted-title font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
            Kho báu Loot & Khung Avatar Hoạt Họa SVG
          </h2>
          <p className="landing-inverted-copy text-sm sm:text-base">
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
                data-selected={isSelected}
                className="landing-loot-card group relative flex cursor-pointer flex-col justify-between p-6"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${item.badgeColor}`}>
                    {item.tier}
                  </span>
                  <span className="landing-accent-text flex items-center gap-1 text-xs font-bold">
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
                  <h3 className="landing-inverted-title font-[var(--font-display)] text-2xl font-bold">
                    {item.name}
                  </h3>
                  <p className="landing-inverted-copy text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="landing-inverted-rule mt-6 border-t pt-4 text-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAuth();
                    }}
                    className="landing-loot-action inline-flex items-center gap-1 text-xs font-bold"
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
        <div className="landing-inverted-rule mt-12 border-t pt-6">
          <div className="grid gap-4 sm:grid-cols-3 text-center sm:text-left">
            <div className="flex items-start gap-3">
              <span className="landing-accent-text flex h-9 w-9 shrink-0 items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h4 className="landing-inverted-title text-sm font-bold">SVG Vector Thuần Khiết</h4>
                <p className="landing-inverted-copy mt-0.5 text-xs">
                  Sắc nét tuyệt đối trên mọi màn hình Retina, không vỡ hạt, tải siêu tốc.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="landing-accent-text flex h-9 w-9 shrink-0 items-center justify-center">
                <Zap className="h-5 w-5" />
              </span>
              <div>
                <h4 className="landing-inverted-title text-sm font-bold">Hoạt Họa Vô Cực (CSS Keyframes)</h4>
                <p className="landing-inverted-copy mt-0.5 text-xs">
                  Các luồng sáng xoay vòng, nhấp nháy pulse tạo phong cách game đẳng cấp.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="landing-accent-text flex h-9 w-9 shrink-0 items-center justify-center">
                <Shield className="h-5 w-5" />
              </span>
              <div>
                <h4 className="landing-inverted-title text-sm font-bold">Tích Lũy & Tùy Biến Hồ Sơ</h4>
                <p className="landing-inverted-copy mt-0.5 text-xs">
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
