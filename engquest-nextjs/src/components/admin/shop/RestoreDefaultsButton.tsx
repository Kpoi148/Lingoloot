"use client";

import { restoreDefaultFrames } from "@/actions/admin/shop.actions";
import { RotateCw } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";

export default function RestoreDefaultsButton() {
    const [isPending, startTransition] = useTransition();

    const handleRestore = () => {
        startTransition(async () => {
            const result = await restoreDefaultFrames();
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <button
            onClick={handleRestore}
            disabled={isPending}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        >
            <RotateCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
            Khôi phục mặc định
        </button>
    );
}
