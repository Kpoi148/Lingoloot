"use client";

import { useState } from "react";
import { equipItem } from "@/actions/shop.actions";
import toast from "react-hot-toast";
import { Shirt, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import InventoryItem, { InventoryItemType } from "@/components/InventoryItem";

interface InventoryModalProps {
    inventoryItems: InventoryItemType[];
    equippedFrame?: string;
    equippedAvatar?: string;
    trigger?: React.ReactNode;
}

export default function InventoryModal({ inventoryItems, equippedFrame, equippedAvatar, trigger }: InventoryModalProps) {
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
            {trigger ? (
                <div onClick={() => setIsOpen(true)}>{trigger}</div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    <Shirt className="h-4 w-4" />
                    Chỉnh sửa giao diện
                </button>
            )}

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
                                            <InventoryItem
                                                key={item._id}
                                                item={item}
                                                isEquipped={isEquipped}
                                                onEquip={() => handleEquip(activeTab, item._id)}
                                                isLoading={loading === item._id}
                                            />
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
