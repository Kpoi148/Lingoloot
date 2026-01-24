import { cn } from "@/lib/utils";

interface FrameProps {
    className?: string;
    avatarUrl?: string;
}

export default function MysticFrame({ className, avatarUrl }: FrameProps) {
    return (
        <div className={cn("relative flex items-center justify-center", className)}>
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

            {/* Outer Runes - Rotating Slowly */}
            <div className="absolute inset-0 animate-[spin_12s_linear_infinite]">
                <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full text-purple-600"
                    style={{ filter: "url(#purple-glow)" }}
                >
                    {/* Decorative Runes / Shapes */}
                    <path
                        d="M50 0 L60 15 L50 30 L40 15 Z"
                        fill="currentColor"
                        opacity="0.8"
                    />
                    <path
                        d="M50 100 L40 85 L50 70 L60 85 Z"
                        fill="currentColor"
                        opacity="0.8"
                    />
                    <path
                        d="M0 50 L15 60 L30 50 L15 40 Z"
                        fill="currentColor"
                        opacity="0.8"
                    />
                    <path
                        d="M100 50 L85 40 L70 50 L85 60 Z"
                        fill="currentColor"
                        opacity="0.8"
                    />
                    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
                </svg>
            </div>

            {/* Middle Ring - Counter Rotate */}
            <div className="absolute inset-0 animate-[spin_8s_linear_infinite_reverse]">
                <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full text-fuchsia-500"
                >
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" fill="none" />
                </svg>
            </div>

            {/* Inner Pulsing Aura */}
            <div className="absolute inset-1 rounded-full bg-purple-500/10 animate-pulse"></div>

            {/* Avatar Container */}
            <div className="relative z-10 h-[70%] w-[70%] overflow-hidden rounded-full border-2 border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                {avatarUrl && (
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                    />
                )}
            </div>
        </div>
    );
}
