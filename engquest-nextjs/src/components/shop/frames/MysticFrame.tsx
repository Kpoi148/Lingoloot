import Image from "next/image";
import { cn } from "@/lib/utils";

interface FrameProps {
    className?: string;
    avatarUrl?: string;
}

export default function MysticFrame({ className, avatarUrl }: FrameProps) {
    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            {/* Avatar Container - Top Layer - Safe Inset */}
            <div className="absolute inset-[15%] z-20 overflow-hidden rounded-full border-2 border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
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

            {/* Glow Def */}
            <svg className="absolute w-0 h-0">
                <defs>
                    <filter id="purple-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>

            {/* Outer Runes - Rotating Slowly - Behind Avatar */}
            <div className="absolute inset-0 pointer-events-none animate-[spin_12s_linear_infinite]">
                <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full text-purple-600"
                    style={{ filter: "url(#purple-glow)" }}
                >
                    {/* Decorative Runes / Shapes - Pushed to corners */}
                    <path
                        d="M50 0 L55 10 L50 20 L45 10 Z"
                        fill="currentColor"
                        opacity="0.8"
                    />
                    <path
                        d="M50 100 L45 90 L50 80 L55 90 Z"
                        fill="currentColor"
                        opacity="0.8"
                    />
                    <path
                        d="M0 50 L10 55 L20 50 L10 45 Z"
                        fill="currentColor"
                        opacity="0.8"
                    />
                    <path
                        d="M100 50 L90 45 L80 50 L90 55 Z"
                        fill="currentColor"
                        opacity="0.8"
                    />
                    <circle cx="50" cy="50" r="49" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
                </svg>
            </div>

            {/* Middle Ring - Counter Rotate - Behind Avatar */}
            <div className="absolute inset-0 pointer-events-none animate-[spin_8s_linear_infinite_reverse]">
                <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full text-fuchsia-500"
                >
                    <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" fill="none" />
                </svg>
            </div>

            {/* Inner Pulsing Aura - Changed to Border to avoid covering face */}
            <div className="absolute inset-0 z-10 pointer-events-none rounded-full border-2 border-purple-500/20 animate-pulse"></div>
        </div>
    );
}
