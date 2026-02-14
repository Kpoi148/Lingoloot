"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { buyItem } from "@/actions/user/shop.actions";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { FrameRenderer } from "@/components/shop/FrameRenderer";
import type { ShopCatalogItem } from "@/types/shop-item";

interface ShopItemCardProps {
    item: ShopCatalogItem;
    isOwned: boolean;
    canAfford: boolean;
    onPurchaseSuccess?: (itemId: string, newBalance: number) => void;
}

export default function ShopItemCard({
    item,
    isOwned,
    canAfford,
    onPurchaseSuccess,
}: ShopItemCardProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleBuy = async () => {
        if (loading || isOwned || !canAfford) return;

        setLoading(true);
        try {
            const result = await buyItem(item._id);
            if (result.success) {
                onPurchaseSuccess?.(item._id, result.newBalance);
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Có lỗi xảy ra khi mua hàng.");
        } finally {
            setLoading(false);
        }
    };

    const rarityColor =
        item.rarity === "legendary"
            ? "text-purple-500 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-500/30"
            : item.rarity === "rare"
                ? "text-blue-500 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-500/30"
                : "text-slate-500 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700";

    return (
        <div className="flex flex-col rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className={cn("mb-3 self-start rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border", rarityColor)}>
                {item.rarity}
            </div>

            <div className="relative mb-4 flex aspect-square items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800">
                <FrameRenderer
                    frameKey={item.renderKey}
                    fallbackImageUrl={item.imageUrl}
                    className="h-full w-full"
                // In Shop Card, we don't have user avatar, so we just show frame placeholder or fallback
                />
            </div>

            <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
            <p className="mb-4 text-xs font-medium text-slate-500 capitalize">{item.type}</p>

            <div className="mt-auto">
                <button
                    onClick={handleBuy}
                    disabled={isOwned || !canAfford || loading}
                    className={cn(
                        "flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-80",
                        isOwned
                            ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                            : canAfford
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600"
                                : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                    )}
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isOwned ? (
                        <>
                            <Check className="h-4 w-4" /> Đã sở hữu
                        </>
                    ) : (
                        <>
                            {item.price} Gems
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
