"use client";
// Admin action button for deleting an existing shop item.

import { deleteShopItem } from "@/actions/admin/shop.actions";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";

export default function DeleteShopItemButton({ itemId }: { itemId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm("Bạn có chắc chắn muốn xóa vật phẩm này không? Hành động này không thể hoàn tác.")) {
            startTransition(async () => {
                const result = await deleteShopItem(itemId);
                if (result.success) {
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
            title="Xóa"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}
