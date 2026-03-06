import Image from "next/image";
import { cn } from "@/lib/shared/utils";

interface FrameProps {
    className?: string;
    avatarUrl?: string;
}

export default function HexFrame({ className, avatarUrl }: FrameProps) {
    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            {/* Avatar Container - Bottom Layer - Safe Inset */}
            <div className="absolute inset-[10%] z-20 overflow-hidden rounded-full bg-slate-900 border-2 border-slate-800">
                {avatarUrl && (
                    <Image
                        src={avatarUrl}
                        alt="Avatar"
                        fill
                        sizes="128px"
                        unoptimized
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            {/* Glow Effect - Behind */}
            <div className="absolute inset-0 bg-yellow-500/30 blur-xl rounded-full scale-100"></div>

            {/* Rotating Outer Golden Ring */}
            <div className="absolute inset-0 z-10 pointer-events-none animate-[spin_10s_linear_infinite]">
                <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]"
                    fill="none"
                    stroke="url(#gold-gradient-outer)"
                    strokeWidth="2"
                >
                    <defs>
                        <linearGradient id="gold-gradient-outer" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FDE68A" />
                            <stop offset="50%" stopColor="#D97706" />
                            <stop offset="100%" stopColor="#FDE68A" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" strokeDasharray="40 10" />
                </svg>
            </div>

            {/* Inner Golden Ring - Solid/Detailed */}
            <div className="absolute inset-0 z-30 pointer-events-none">
                <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full"
                    fill="none"
                    stroke="url(#gold-gradient-inner)"
                    strokeWidth="3"
                >
                    <defs>
                        <linearGradient id="gold-gradient-inner" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#D97706" />
                            <stop offset="50%" stopColor="#FCD34D" />
                            <stop offset="100%" stopColor="#D97706" />
                        </linearGradient>
                    </defs>
                    {/* Main Border Circle */}
                    <circle cx="50" cy="50" r="44" />
                </svg>
            </div>

            {/* Decorative Shimmers/Sparkles */}
            <div className="absolute inset-[-5%] z-30 pointer-events-none animate-[spin_4s_linear_infinite_reverse]">
                <svg viewBox="0 0 100 100" className="h-full w-full opacity-80">
                    <circle cx="50" cy="5" r="2" fill="#FEF3C7" className="animate-pulse" />
                    <circle cx="50" cy="95" r="2" fill="#FEF3C7" className="animate-pulse" />
                    <circle cx="5" cy="50" r="2" fill="#FEF3C7" className="animate-pulse" />
                    <circle cx="95" cy="50" r="2" fill="#FEF3C7" className="animate-pulse" />
                </svg>
            </div>

            {/* Sunlight Shimmer Effect - Premium Motion */}
            <div className="absolute inset-0 z-40 pointer-events-none rounded-full overflow-hidden">
                <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{ backgroundSize: '50% 100%', backgroundRepeat: 'no-repeat' }}></div>
            </div>
        </div>
    );
}
