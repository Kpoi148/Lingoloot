"use client";
// Showcase component for cosmetic AI-generated animated SVG frames and Loot rewards.

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Shield, Zap, ArrowRight, Gift } from "lucide-react";
import { motion } from "framer-motion";
import TechFrame from "@/components/shop/frames/TechFrame";
import MysticFrame from "@/components/shop/frames/MysticFrame";
import HexFrame from "@/components/shop/frames/HexFrame";

type ShowcaseItem = {
  id: string;
  name: string;
  tier: "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";
  gemCost: number;
  description: string;
  frameType: "hex" | "tech" | "solar" | "frost" | "chrono" | "mystic" | "void" | "phoenix" | "chest";
  badgeColor: string;
  tag: string;
  glowClass: string;
};

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "hex",
    name: "Hex Shield V1",
    tier: "Common",
    gemCost: 50,
    description: "Khung lục giác tối giản với đường cắt kim loại thanh thoát và ánh kim hoàng tộc.",
    frameType: "hex",
    badgeColor: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    tag: "Khởi đầu",
    glowClass: "hover:border-amber-500/50 hover:shadow-amber-500/10",
  },
  {
    id: "tech",
    name: "Cyber Pulse Nexus",
    tier: "Rare",
    gemCost: 250,
    description: "Mạch điện tử ma trận màu xanh ngọc lam xoay chuyển vô cực do Gemini AI thiết kế.",
    frameType: "tech",
    badgeColor: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    tag: "Chuyển động",
    glowClass: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
  },
  {
    id: "solar",
    name: "Solar Flare Aegis",
    tier: "Rare",
    gemCost: 350,
    description: "Vành nhật hoa rực lửa với các tia sáng plasma mặt trời xoay vòng rực rỡ và ấm áp.",
    frameType: "solar",
    badgeColor: "border-orange-400/30 bg-orange-400/10 text-orange-300",
    tag: "Nhiệt năng",
    glowClass: "hover:border-orange-500/50 hover:shadow-orange-500/10",
  },
  {
    id: "frost",
    name: "Frostbite Glacial Orb",
    tier: "Epic",
    gemCost: 600,
    description: "Tinh thể băng vĩnh cửu sắc lạnh phát ánh quang xanh tuyết băng giá từ đỉnh núi tuyết.",
    frameType: "frost",
    badgeColor: "border-sky-400/30 bg-sky-400/10 text-sky-300",
    tag: "Băng giá",
    glowClass: "hover:border-sky-500/50 hover:shadow-sky-500/10",
  },
  {
    id: "chrono",
    name: "Chrono Gear Automaton",
    tier: "Epic",
    gemCost: 850,
    description: "Hệ thống bánh răng Steampunk đồng kim đan xen nhịp nhàng tượng trưng cho sự kiên trì.",
    frameType: "chrono",
    badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    tag: "Thời gian",
    glowClass: "hover:border-amber-500/50 hover:shadow-amber-500/10",
  },
  {
    id: "mystic",
    name: "Astral Rune Overlord",
    tier: "Legendary",
    gemCost: 1200,
    description: "Cổ ngữ thần bí phát sáng hào quang tím ma thuật đỉnh cao kích hoạt khi đạt chuỗi 14 ngày.",
    frameType: "mystic",
    badgeColor: "border-purple-400/30 bg-purple-400/10 text-purple-300",
    tag: "Cực hiếm",
    glowClass: "hover:border-purple-500/50 hover:shadow-purple-500/10",
  },
  {
    id: "void",
    name: "Void Eclipse Matrix",
    tier: "Legendary",
    gemCost: 1800,
    description: "Vòng xoáy hư không đối xứng hút sáng vũ trụ với luồng sóng hạt lượng tử hồng tím ma mị.",
    frameType: "void",
    badgeColor: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-300",
    tag: "Hư không",
    glowClass: "hover:border-fuchsia-500/50 hover:shadow-fuchsia-500/10",
  },
  {
    id: "phoenix",
    name: "Phoenix Rebirth Halo",
    tier: "Mythic",
    gemCost: 2800,
    description: "Hào quang phượng hoàng ngũ sắc tái sinh từ tro tàn lửa đỏ, trao tặng cho bậc thầy ngôn ngữ.",
    frameType: "phoenix",
    badgeColor: "border-rose-400/30 bg-rose-400/10 text-rose-300",
    tag: "Tái sinh",
    glowClass: "hover:border-rose-500/50 hover:shadow-rose-500/10",
  },
  {
    id: "chest",
    name: "Mystery Dragon Vault",
    tier: "Mythic",
    gemCost: 3500,
    description: "Rương kho báu rồng thiêng chứa mảnh ghép khung thần thoại và x2 nhân đôi đá quý vĩnh viễn.",
    frameType: "chest",
    badgeColor: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    tag: "Thần thoại",
    glowClass: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
  },
];

function RenderAvatarFrame({ frameType }: { frameType: ShowcaseItem["frameType"] }) {
  if (frameType === "hex") {
    return <HexFrame className="h-full w-full" avatarUrl="/logo.png" />;
  }
  if (frameType === "tech") {
    return <TechFrame className="h-full w-full" avatarUrl="/logo.png" />;
  }
  if (frameType === "mystic") {
    return <MysticFrame className="h-full w-full" avatarUrl="/logo.png" />;
  }
  if (frameType === "solar") {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-orange-500/25 blur-xl" />
        <div className="absolute inset-[15%] z-20 overflow-hidden rounded-full border-2 border-orange-400/70 bg-slate-900 shadow-[0_0_15px_rgba(249,115,22,0.6)]">
          <Image src="/logo.png" alt="Avatar" fill sizes="128px" unoptimized className="h-full w-full object-cover" />
        </div>
        {/* Outer Solar Rays - Rotating */}
        <div className="absolute inset-0 pointer-events-none animate-[spin_10s_linear_infinite]">
          <svg viewBox="0 0 100 100" className="h-full w-full text-orange-500" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="50" cy="50" r="47" strokeDasharray="6 8" />
            <polygon points="50,2 53,10 47,10" fill="currentColor" />
            <polygon points="50,98 53,90 47,90" fill="currentColor" />
            <polygon points="2,50 10,53 10,47" fill="currentColor" />
            <polygon points="98,50 90,53 90,47" fill="currentColor" />
          </svg>
        </div>
        {/* Inner Warm Ring - Counter Rotating */}
        <div className="absolute inset-1.5 pointer-events-none animate-[spin_6s_linear_infinite_reverse]">
          <svg viewBox="0 0 100 100" className="h-full w-full text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="50" cy="50" r="44" strokeDasharray="14 10" />
          </svg>
        </div>
      </div>
    );
  }
  if (frameType === "frost") {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-sky-500/25 blur-xl" />
        <div className="absolute inset-[15%] z-20 overflow-hidden rounded-full border-2 border-sky-300/70 bg-slate-900 shadow-[0_0_15px_rgba(56,189,248,0.6)]">
          <Image src="/logo.png" alt="Avatar" fill sizes="128px" unoptimized className="h-full w-full object-cover" />
        </div>
        {/* Outer Glacial Spikes - Rotating */}
        <div className="absolute inset-0 pointer-events-none animate-[spin_14s_linear_infinite]">
          <svg viewBox="0 0 100 100" className="h-full w-full text-sky-400" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="50,0 52,14 48,14" fill="currentColor" />
            <polygon points="50,100 52,86 48,86" fill="currentColor" />
            <polygon points="0,50 14,52 14,48" fill="currentColor" />
            <polygon points="100,50 86,52 86,48" fill="currentColor" />
            <circle cx="50" cy="50" r="46" strokeDasharray="10 14" />
          </svg>
        </div>
        {/* Inner Ice Shard Ring */}
        <div className="absolute inset-2 pointer-events-none animate-[spin_8s_linear_infinite_reverse]">
          <svg viewBox="0 0 100 100" className="h-full w-full text-cyan-200" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="50" cy="50" r="44" strokeDasharray="4 8" />
          </svg>
        </div>
      </div>
    );
  }
  if (frameType === "chrono") {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-amber-600/20 blur-xl" />
        <div className="absolute inset-[15%] z-20 overflow-hidden rounded-full border-2 border-amber-500/70 bg-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
          <Image src="/logo.png" alt="Avatar" fill sizes="128px" unoptimized className="h-full w-full object-cover" />
        </div>
        {/* Steampunk Cogwheel - Rotating */}
        <div className="absolute inset-0 pointer-events-none animate-[spin_9s_linear_infinite]">
          <svg viewBox="0 0 100 100" className="h-full w-full text-amber-500" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="50" cy="50" r="46" strokeDasharray="2 6" strokeWidth="3" />
            <circle cx="50" cy="50" r="47" strokeDasharray="16 12" strokeWidth="2.5" />
          </svg>
        </div>
        {/* Clock Dials - Counter Rotating */}
        <div className="absolute inset-1.5 pointer-events-none animate-[spin_15s_linear_infinite_reverse]">
          <svg viewBox="0 0 100 100" className="h-full w-full text-amber-300" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="50" y1="4" x2="50" y2="10" strokeWidth="2" />
            <line x1="50" y1="90" x2="50" y2="96" strokeWidth="2" />
            <line x1="4" y1="50" x2="10" y2="50" strokeWidth="2" />
            <line x1="90" y1="50" x2="96" y2="50" strokeWidth="2" />
            <circle cx="50" cy="50" r="43" strokeDasharray="6 12" />
          </svg>
        </div>
      </div>
    );
  }
  if (frameType === "void") {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-fuchsia-600/30 blur-xl" />
        <div className="absolute inset-[15%] z-20 overflow-hidden rounded-full border-2 border-fuchsia-400/70 bg-slate-900 shadow-[0_0_18px_rgba(217,70,239,0.7)]">
          <Image src="/logo.png" alt="Avatar" fill sizes="128px" unoptimized className="h-full w-full object-cover" />
        </div>
        {/* Void Spiral Arms - Rotating */}
        <div className="absolute inset-0 pointer-events-none animate-[spin_7s_linear_infinite]">
          <svg viewBox="0 0 100 100" className="h-full w-full text-fuchsia-500" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M50 4 A46 46 0 0 1 96 50" strokeDasharray="30 20" />
            <path d="M50 96 A46 46 0 0 1 4 50" strokeDasharray="30 20" />
            <circle cx="50" cy="4" r="2.5" fill="currentColor" stroke="none" />
            <circle cx="50" cy="96" r="2.5" fill="currentColor" stroke="none" />
          </svg>
        </div>
        {/* Quantum Ring - Counter Rotating */}
        <div className="absolute inset-1.5 pointer-events-none animate-[spin_5s_linear_infinite_reverse]">
          <svg viewBox="0 0 100 100" className="h-full w-full text-pink-300" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="50" cy="50" r="44" strokeDasharray="8 12" />
          </svg>
        </div>
      </div>
    );
  }
  if (frameType === "phoenix") {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-rose-500/30 blur-xl animate-pulse" />
        <div className="absolute inset-[15%] z-20 overflow-hidden rounded-full border-2 border-rose-400/80 bg-slate-900 shadow-[0_0_20px_rgba(244,63,94,0.7)]">
          <Image src="/logo.png" alt="Avatar" fill sizes="128px" unoptimized className="h-full w-full object-cover" />
        </div>
        {/* Phoenix Wings / Holy Flare - Rotating */}
        <div className="absolute inset-0 pointer-events-none animate-[spin_11s_linear_infinite]">
          <svg viewBox="0 0 100 100" className="h-full w-full text-rose-400" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="50" cy="50" r="47" strokeDasharray="18 10" />
            <path d="M50 4 Q65 18 80 14" strokeWidth="2" />
            <path d="M50 96 Q35 82 20 86" strokeWidth="2" />
            <path d="M4 50 Q18 35 14 20" strokeWidth="2" />
            <path d="M96 50 Q82 65 86 80" strokeWidth="2" />
          </svg>
        </div>
        {/* Golden Core Halo */}
        <div className="absolute inset-1.5 pointer-events-none animate-[spin_7s_linear_infinite_reverse]">
          <svg viewBox="0 0 100 100" className="h-full w-full text-amber-300" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="50" cy="50" r="44" strokeDasharray="12 16" />
          </svg>
        </div>
      </div>
    );
  }
  if (frameType === "chest") {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
        <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
          <svg viewBox="0 0 100 100" className="h-full w-full text-emerald-400/60" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="50" cy="50" r="46" strokeDasharray="8 12" />
          </svg>
        </div>
        <div className="relative z-10 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border-2 border-emerald-400/40 bg-slate-900 text-emerald-400 shadow-xl shadow-emerald-500/20">
          <Gift className="h-8 w-8 sm:h-10 sm:w-10 animate-bounce" />
        </div>
      </div>
    );
  }
  return null;
}

export default function LootShowcase({ onOpenAuth }: { onOpenAuth: () => void }) {
  const [activeItem, setActiveItem] = useState<string>("tech");
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  // Measure available horizontal scroll distance with ResizeObserver for responsiveness
  useEffect(() => {
    if (!trackRef.current) return;
    const el = trackRef.current;
    const updateDimensions = () => {
      const scrollable = el.scrollWidth - el.clientWidth;
      setMaxScroll(Math.max(scrollable, 0));
    };

    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(el);
    window.addEventListener("resize", updateDimensions);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Track scroll position of the section strictly within its pinning duration
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const trackDistance = containerRef.current.offsetHeight - window.innerHeight;
      if (trackDistance <= 0) return;
      // 0 when section hits viewport top, 1 when section finishes pinning
      const p = Math.min(Math.max(-rect.top / trackDistance, 0), 1);
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const translateX = -progress * maxScroll;

  return (
    <section
      ref={containerRef}
      id="vault"
      className="relative min-h-[500vh] sm:min-h-[580vh] bg-slate-950 text-white scroll-mt-12"
    >
      {/* Sticky Viewport: Pins when scrolling through this section, cleared under sticky navbar */}
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden pt-28 pb-3 sm:pt-32 sm:pb-5">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col h-full justify-between">
          
          {/* Header Bar with Scrub Progress */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-white/10 pb-3 sm:pb-4 shrink-0">
            <div className="max-w-2xl space-y-1">
              <p className="landing-inverted-label landing-kicker text-[11px] sm:text-xs font-mono font-semibold tracking-wider text-amber-400">
                CHƯƠNG 04 &mdash; KHO BÁU & KHUNG SVG HOẠT HỌA
              </p>
              <h2 className="landing-inverted-title font-[var(--font-display)] text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                Triển Lãm Chiến Lợi Phẩm & Khung Avatar AI
              </h2>
              <p className="landing-inverted-copy text-xs sm:text-sm text-slate-400">
                Lăn chuột để lướt qua dải băng chuyền 9 bộ sưu tập khung chuyển động SVG độc bản.
              </p>
            </div>

            {/* Gallery Scrub Visual Indicator */}
            <div className="flex items-center gap-3 self-start md:self-end shrink-0">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-mono text-[11px]">Cuộn chuột để trượt ngang ({Math.round(progress * 100)}%)</span>
              </div>
              <div className="hidden sm:block w-36 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  style={{ width: `${progress * 100}%` }}
                  className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 transition-[width] duration-75 ease-out"
                />
              </div>
            </div>
          </div>

          {/* Desktop & Tablet: Horizontal Gallery Scrub Strip */}
          <div ref={trackRef} className="hidden md:block relative my-auto w-full overflow-hidden py-1 sm:py-2">
            <motion.div
              animate={{ x: translateX }}
              transition={{ ease: "easeOut", duration: 0.1 }}
              className="flex gap-5 lg:gap-6 items-stretch will-change-transform pr-16"
            >
              {SHOWCASE_ITEMS.map((item, idx) => {
                const isSelected = activeItem === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveItem(item.id)}
                    data-selected={isSelected}
                    className={`landing-loot-card group relative flex w-[280px] sm:w-[310px] lg:w-[340px] shrink-0 cursor-pointer flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/90 p-4 sm:p-5 shadow-2xl backdrop-blur-md transition-all duration-300 ${item.glowClass} ${
                      isSelected
                        ? "ring-2 ring-amber-400/40 border-amber-400/40 bg-slate-900"
                        : "opacity-85 hover:opacity-100"
                    }`}
                  >
                    {/* Top Badge & Number */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500 font-bold">
                          0{idx + 1}.
                        </span>
                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${item.badgeColor}`}>
                          {item.tier}
                        </span>
                      </div>
                      <span className="landing-accent-text flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        {item.gemCost} Gems
                      </span>
                    </div>

                    {/* Animated Avatar Center Display */}
                    <div className="my-2 sm:my-3 flex items-center justify-center">
                      <div className="relative h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 transition duration-300 group-hover:scale-105">
                        <RenderAvatarFrame frameType={item.frameType} />
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="space-y-1 text-center">
                      <h3 className="landing-inverted-title font-[var(--font-display)] text-base sm:text-lg font-bold">
                        {item.name}
                      </h3>
                      <p className="landing-inverted-copy text-xs leading-relaxed text-slate-400 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Action */}
                    <div className="landing-inverted-rule mt-3 sm:mt-4 border-t border-white/10 pt-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAuth();
                        }}
                        className="landing-loot-action inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                      >
                        <span>Mở khóa trong Shop</span>
                        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Mobile Fallback: Smooth horizontal swipe with snap */}
          <div className="block md:hidden my-auto w-full overflow-x-auto pb-4 snap-x snap-mandatory flex gap-4 scrollbar-none">
            {SHOWCASE_ITEMS.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className="landing-loot-card flex w-[280px] shrink-0 snap-center flex-col justify-between rounded-2xl border border-white/10 bg-slate-900 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-500">0{idx + 1}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${item.badgeColor}`}>
                    {item.tier}
                  </span>
                </div>
                <div className="my-4 flex items-center justify-center">
                  <div className="relative h-28 w-28">
                    <RenderAvatarFrame frameType={item.frameType} />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-bold text-base">{item.name}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                </div>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="mt-4 w-full rounded-xl bg-amber-500/10 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/20"
                >
                  Mở khóa trong Shop →
                </button>
              </div>
            ))}
          </div>

          {/* Feature Highlights beneath */}
          <div className="border-t border-white/10 pt-3 pb-1 shrink-0">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <span className="landing-accent-text flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                </span>
                <div>
                  <h4 className="landing-inverted-title text-xs font-bold">SVG Vector Thuần Khiết</h4>
                  <p className="landing-inverted-copy text-[11px] text-slate-400">
                    Sắc nét tuyệt đối trên mọi màn hình Retina, không vỡ hạt.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="landing-accent-text flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  <Zap className="h-3.5 w-3.5 text-cyan-400" />
                </span>
                <div>
                  <h4 className="landing-inverted-title text-xs font-bold">Hoạt Họa Vô Cực (CSS Keyframes)</h4>
                  <p className="landing-inverted-copy text-[11px] text-slate-400">
                    Các luồng sáng xoay vòng, nhấp nháy tạo chiều sâu điện ảnh.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="landing-accent-text flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  <Shield className="h-3.5 w-3.5 text-purple-400" />
                </span>
                <div>
                  <h4 className="landing-inverted-title text-xs font-bold">Tích Lũy & Tùy Biến Hồ Sơ</h4>
                  <p className="landing-inverted-copy text-[11px] text-slate-400">
                    Trang bị ngay vào Profile để vinh danh hành trình săn Loot.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
