"use client";

import { useState } from "react";
import Image from "next/image";
import { equipItem } from "@/actions/shop.actions";
import toast from "react-hot-toast";
import { Check, Loader2, Shirt, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FrameRenderer } from "@/lib/frame-registry";

interface ShopItem {
    _id: string;
    name: string;
    type: string;
    imageUrl: string;
    renderKey?: string;
}

interface InventoryModalProps {
    inventoryItems: ShopItem[];
    equippedFrame?: string;
    equippedAvatar?: string;
}

export default function InventoryModal({ inventoryItems, equippedFrame, equippedAvatar }: InventoryModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"frame" | "avatar">("frame");
    const router = useRouter();

    const frames = inventoryItems.filter((i) => i.type === "frame");
    const avatars = inventoryItems.filter((i) => i.type === "avatar");

    const handleEquip = async (type: "frame" | "avatar", itemId: string) => {
        setLoading(itemId);
        try {
            const result = await equipItem(type, itemId);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Lỗi khi trang bị.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
                <Shirt className="h-4 w-4" />
                Chỉnh sửa giao diện
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
                    <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800 shrink-0">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Kho Đồ</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                            >
                                <span className="sr-only">Close</span>
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 flex-grow overflow-y-auto">
                            <div className="mb-6 flex gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                                <button
                                    onClick={() => setActiveTab("frame")}
                                    className={cn(
                                        "flex-1 rounded-lg py-2 text-sm font-bold transition-all",
                                        activeTab === "frame"
                                            ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                                    )}
                                >
                                    Khung viền
                                </button>
                                <button
                                    onClick={() => setActiveTab("avatar")}
                                    className={cn(
                                        "flex-1 rounded-lg py-2 text-sm font-bold transition-all",
                                        activeTab === "avatar"
                                            ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                                    )}
                                >
                                    Ảnh đại diện
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 max-h-[400px] overflow-y-auto p-1">
                                {(activeTab === "frame" ? frames : avatars).length === 0 ? (
                                    <p className="col-span-full py-10 text-center text-slate-500">
                                        Bạn chưa sở hữu vật phẩm nào loại này.
                                    </p>
                                ) : (
                                    (activeTab === "frame" ? frames : avatars).map((item) => {
                                        const isEquipped =
                                            activeTab === "frame"
                                                ? equippedFrame === item._id
                                                : equippedAvatar === item._id;

                                        return (
                                            <div
                                                key={item._id}
                                                className={cn(
                                                    "relative flex flex-col items-center rounded-2xl border p-4 transition cursor-pointer hover:shadow-md",
                                                    isEquipped
                                                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500"
                                                        : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                                                )}
                                                onClick={() => !isEquipped && handleEquip(activeTab, item._id)}
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
                                                    // For avatar preview we might want to show user avatar if it's a frame, 
                                                    // but here it's just the item selection.
                                                    />
                                                </div>
                                                <p className="text-center text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    {item.name}
                                                </p>

                                                {loading === item._id && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 rounded-2xl">
                                                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
