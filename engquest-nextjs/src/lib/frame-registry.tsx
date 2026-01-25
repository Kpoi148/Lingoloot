import TechFrame from "@/components/shop/frames/TechFrame";
import MysticFrame from "@/components/shop/frames/MysticFrame";
import HexFrame from "@/components/shop/frames/HexFrame";

export const FRAME_REGISTRY = {
    "tech-svg": TechFrame,
    "mystic-svg": MysticFrame,
    "hex-svg": HexFrame,
};

export type FrameKey = keyof typeof FRAME_REGISTRY;

interface FrameRendererProps {
    frameKey?: string | null;
    className?: string;
    avatarUrl?: string;
    fallbackImageUrl?: string; // Standard PNG frame image
}

export function FrameRenderer({
    frameKey,
    className,
    avatarUrl,
    fallbackImageUrl,
}: FrameRendererProps) {
    // Check if frameKey exists in registry
    const FrameComponent =
        frameKey && frameKey in FRAME_REGISTRY
            ? FRAME_REGISTRY[frameKey as FrameKey]
            : null;

    if (FrameComponent) {
        return <FrameComponent className={className} avatarUrl={avatarUrl} />;
    }

    // Fallback to standard Image frame + Avatar overlay
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {/* Avatar (Bottom Layer) */}
            <div className={`absolute overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 ${fallbackImageUrl ? 'inset-[15%]' : 'inset-0'}`}>
                {avatarUrl && (
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                )}
            </div>

            {/* Static Frame Image (Top Layer) */}
            {fallbackImageUrl && (
                <img
                    src={fallbackImageUrl}
                    alt="Frame"
                    className="relative z-10 h-full w-full object-contain"
                    style={{ pointerEvents: 'none' }}
                />
            )}
        </div>
    );
}
