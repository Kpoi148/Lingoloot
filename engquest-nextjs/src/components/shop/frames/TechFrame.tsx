import Image from "next/image";
import { cn } from "@/lib/utils";

interface FrameProps {
    className?: string;
    avatarUrl?: string;
}

export default function TechFrame({ className, avatarUrl }: FrameProps) {
    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            {/* Avatar Container - Bottom Layer - Safe Inset */}
            <div className="absolute inset-[15%] overflow-hidden rounded-full bg-slate-900 border-2 border-slate-800">
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

            {/* Outer Rotating Ring - Behind Avatar */}
            <div className="absolute inset-0 pointer-events-none animate-[spin_8s_linear_infinite]">
                <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full text-cyan-500/50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                >
                    {/* Dashed Circle - Pushed to edge */}
                    <circle cx="50" cy="50" r="48" strokeDasharray="10 15" strokeWidth="1" />
                    {/* Tech Markers - On the edge */}
                    <circle cx="50" cy="1.5" r="1.5" className="fill-cyan-400" stroke="none" />
                    <circle cx="50" cy="98.5" r="1.5" className="fill-cyan-400" stroke="none" />
                    <circle cx="1.5" cy="50" r="1.5" className="fill-cyan-400" stroke="none" />
                    <circle cx="98.5" cy="50" r="1.5" className="fill-cyan-400" stroke="none" />
                </svg>
            </div>

            {/* Inner Rotating Ring (Counter) - Behind Avatar */}
            <div className="absolute inset-1 pointer-events-none animate-[spin_5s_linear_infinite_reverse]">
                <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                >
                    <path
                        d="M50 2 A48 48 0 0 1 98 50"
                        strokeDasharray="100" /* Gap created by path length */
                        strokeOpacity="0.7"
                    />
                    <path
                        d="M50 98 A48 48 0 0 1 2 50"
                        strokeDasharray="100"
                        strokeOpacity="0.7"
                    />
                </svg>
            </div>

            {/* Static Glow - Behind Avatar */}
            <div className="absolute inset-0 rounded-full border border-cyan-300/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]"></div>

        </div>
    );
}
