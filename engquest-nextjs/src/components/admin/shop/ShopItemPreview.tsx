"use client";
// Preview card for checking how a shop item will appear before saving.

import { FrameRenderer } from "@/components/shop/FrameRenderer";
import Image from "next/image";
import type { ShopVisualItem } from "@/types/shop-item";

interface ShopItemPreviewProps {
    item: ShopVisualItem;
}

export default function ShopItemPreview({ item }: ShopItemPreviewProps) {
    // If it's a frame and has a valid renderKey, render the actual Frame Component
    // We pass a dummy avatar to visualize the frame effect clearly
    if (item.type === 'frame' && item.renderKey) {
        return (
            <div className="relative h-16 w-16">
                {/* Using FrameRenderer to show the live component */}
                <FrameRenderer
                    frameKey={item.renderKey}
                    avatarUrl="/avatarDefault.png" // Use default avatar for preview
                    fallbackImageUrl={item.renderKey.includes('svg') ? undefined : item.imageUrl}
                    className="h-full w-full"
                />
            </div>
        );
    }

    // Fallback for non-frames or items without renderKey (e.g. AI generated ones that might just be images)
    // Note: AI generated items might treat 'imageUrl' as the source. 
    // If AI generated items don't have a renderKey but rely on imageUrl, FrameRenderer's fallback logic handles it IF we passed it there.
    // However, here we just want to ensure DEFAULT items (with renderKey) show up correctly.

    return (
        <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
            <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-contain p-1"
            />
        </div>
    );
}
