"use client";

import { useState } from "react";
import ShopItemCard from "./ShopItemCard";
import { cn } from "@/lib/utils";
import { LayoutGrid, User } from "lucide-react";

interface ShopItem {
    _id: string;
    name: string;
    type: string;
    imageUrl: string;
    price: number;
    rarity: string;
}

interface ShopClientProps {
    items: ShopItem[];
    inventory: string[];
    currency: number;
}

export default function ShopClient({ items, inventory, currency }: ShopClientProps) {
    const [activeTab, setActiveTab] = useState<"frame" | "avatar">("frame");

    const frames = items.filter((item) => item.type === "frame");
    const avatars = items.filter((item) => item.type === "avatar");
    const filteredItems = activeTab === "frame" ? frames : avatars;

    return (
        <div className="space-y-8">
            {/* Tabs */}
            <div className="flex gap-2 rounded-2xl bg-white p-1.5 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800 w-fit">
                <button
                    onClick={() => setActiveTab("frame")}
                    className={cn(
                        "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
                        activeTab === "frame"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    )}
                >
                    <LayoutGrid className="h-4 w-4" />
                    Khung Hồ Sơ
                </button>
                <button
                    onClick={() => setActiveTab("avatar")}
                    className={cn(
                        "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
                        activeTab === "avatar"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    )}
                >
                    <User className="h-4 w-4" />
                    Ảnh Đại Diện
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <ShopItemCard
                            key={item._id}
                            item={item}
                            isOwned={inventory.includes(item._id)}
                            canAfford={currency >= item.price}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                            {activeTab === "frame" ? <LayoutGrid className="h-8 w-8 text-slate-400" /> : <User className="h-8 w-8 text-slate-400" />}
                        </div>
                        <p className="text-slate-500">Chưa có vật phẩm nào trong mục này.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
