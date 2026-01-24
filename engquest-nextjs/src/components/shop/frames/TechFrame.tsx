import { cn } from "@/lib/utils";

interface FrameProps {
    className?: string;
    avatarUrl?: string;
}

export default function TechFrame({ className, avatarUrl }: FrameProps) {
    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            {/* Outer Rotating Ring */}
            <div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
                <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full text-cyan-500/50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                >
                    {/* Dashed Circle */}
                    <circle cx="50" cy="50" r="48" strokeDasharray="10 15" />
                    {/* Tech Markers */}
                    <circle cx="50" cy="2" r="2" className="fill-cyan-400" stroke="none" />
                    <circle cx="50" cy="98" r="2" className="fill-cyan-400" stroke="none" />
                    <circle cx="2" cy="50" r="2" className="fill-cyan-400" stroke="none" />
                    <circle cx="98" cy="50" r="2" className="fill-cyan-400" stroke="none" />
                </svg>
            </div>

            {/* Inner Rotating Ring (Counter) */}
            <div className="absolute inset-1 animate-[spin_5s_linear_infinite_reverse]">
                <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                >
                    <path
                        d="M50 5 A45 45 0 0 1 95 50"
                        strokeDasharray="100" /* Gap created by path length */
                        strokeOpacity="0.7"
                    />
                    <path
                        d="M50 95 A45 45 0 0 1 5 50"
                        strokeDasharray="100"
                        strokeOpacity="0.7"
                    />
                </svg>
            </div>

            {/* Static Glow */}
            <div className="absolute inset-2 rounded-full border border-cyan-300/30 shadow-[0_0_15px_rgba(34,211,238,0.4)]"></div>

            {/* Avatar Container */}
            <div className="relative z-10 h-[80%] w-[80%] overflow-hidden rounded-full bg-slate-900 border-2 border-slate-800">
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
