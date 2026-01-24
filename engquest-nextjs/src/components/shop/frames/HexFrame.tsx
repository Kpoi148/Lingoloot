import { cn } from "@/lib/utils";

interface FrameProps {
    className?: string;
    avatarUrl?: string;
}

export default function HexFrame({ className, avatarUrl }: FrameProps) {
    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            {/* Glow */}
            <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full scale-110"></div>

            {/* Animated Hex Borders */}
            <div className="absolute inset-0">
                <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]"
                    fill="none"
                    stroke="url(#gold-gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <defs>
                        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FDE68A" />
                            <stop offset="50%" stopColor="#D97706" />
                            <stop offset="100%" stopColor="#FDE68A" />
                        </linearGradient>
                    </defs>
                    {/* Hexagon Path */}
                    <path d="M50 2 L93.3 27 V77 L50 102 L6.7 77 V27 Z" />
                </svg>

                {/* Rotating Highlight */}
                <div className="absolute inset-[-10%] animate-[spin_6s_linear_infinite]">
                    <div className="h-full w-[2px] bg-white/50 blur-sm rotate-45 mx-auto"></div>
                </div>
            </div>

            {/* Inner Avatar - Clip to Hexagon */}
            <div className="relative z-10 h-[86%] w-[86%] overflow-hidden"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                {/* Background if transparent */}
                <div className="absolute inset-0 bg-slate-900"></div>
                {avatarUrl && (
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                    />
                )}
                <div className="absolute inset-0 border-[3px] border-yellow-500/30" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
            </div>
        </div>
    );
}
