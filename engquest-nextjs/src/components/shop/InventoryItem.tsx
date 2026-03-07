// Inventory tile that shows ownership and equip state for one cosmetic item.
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/shared/utils";
import { FrameRenderer } from "@/components/shop/FrameRenderer";
import type { ShopVisualItem } from "@/types/shop-item";

export type InventoryItemType = ShopVisualItem;

type InventoryItemProps = {
    item: InventoryItemType;
    isEquipped: boolean;
    onEquip: () => void;
    isLoading: boolean;
};

/**
 * Single Inventory Item Component
 * Responsible for rendering individual item state (equipped, loading, display)
 */
export default function InventoryItem({
    item,
    isEquipped,
    onEquip,
    isLoading
}: InventoryItemProps) {
    return (
        <div
            className={cn(
                "relative flex flex-col items-center rounded-2xl border p-4 transition cursor-pointer hover:shadow-md",
                isEquipped
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500"
                    : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
            )}
            onClick={() => !isEquipped && onEquip()}
        >
            {isEquipped && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1">
                    <Check className="w-3 h-3" />
                </div>
            )}

            <div className="relative mb-3 h-20 w-20 flex items-center justify-center">
                <FrameRenderer
                    frameKey={item.renderKey}
                    fallbackImageUrl={item.imageUrl}
                    className="h-full w-full"
                />
            </div>
            <p className="text-center text-xs font-bold text-slate-700 dark:text-slate-300">
                {item.name}
            </p>

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 rounded-2xl">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                </div>
            )}
        </div>
    );
}
