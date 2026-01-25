"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { generateAIFrame, saveAIFrameToShop } from "@/actions/ai-shop.actions";
import { FrameRenderer } from "@/lib/frame-registry";
import { Loader2, Save, RefreshCw, Wand2, Check, Sparkles, Zap } from "lucide-react";

type FrameGeneratorProps = {
    userAvatarUrl?: string;
};

export default function FrameGenerator({ userAvatarUrl }: FrameGeneratorProps) {
    const [prompt, setPrompt] = useState("");
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, startGeneration] = useTransition();
    const [isSaving, startSaving] = useTransition();

    // Generation Handler
    const handleGenerate = () => {
        if (!prompt) {
            toast.error("Vui lòng nhập mô tả ý tưởng!");
            return;
        }

        startGeneration(async () => {
            const result = await generateAIFrame(prompt, "auto");
            if (result.success && result.imageUrl) {
                setGeneratedImage(result.imageUrl);
                toast.success("Đã tạo khung thành công! 🎨");
            } else {
                toast.error(result.msg || "Có lỗi xảy ra khi tạo khung.");
            }
        });
    };

    // Save to Shop Handler
    const handleSaveToShop = () => {
        if (!generatedImage) return;

        const frameName = window.prompt("Đặt tên cho khung viền của bạn:", "My Cool Frame");
        if (!frameName) return;

        startSaving(async () => {
            const result = await saveAIFrameToShop({
                name: frameName,
                imageUrl: generatedImage,
                price: 100,
                rarity: "rare",
            });

            if (result.success) {
                toast.success("Đã lưu khung vào Shop! 🛍️");
                setGeneratedImage(null);
                setPrompt("");
            } else {
                toast.error("Lỗi khi lưu vào Shop.");
            }
        });
    };

    return (
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* LEFT: Configuration Panel */}
            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Ý tưởng của bạn</h3>
                    </div>

                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Mô tả ý tưởng khung viền... (Ví dụ: Vòng lửa rồng cuộn, hào quang sấm sét...)"
                        className="h-32 w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-900 shadow-sm"
                        disabled={isGenerating}
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-slate-900 px-6 py-4 font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl transition-opacity group-hover:opacity-40" />
                    {isGenerating ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            <Wand2 className="h-5 w-5" />
                            Tạo Khung (Miễn Phí)
                        </>
                    )}
                </button>

                <p className="text-center text-xs text-slate-400 px-4">
                    *Mẹo: Thử mô tả màu sắc (xanh, đỏ) hoặc hình dáng (vuông, tròn) để AI hiểu rõ hơn.
                </p>
            </div>

            {/* RIGHT: Preview Studio */}
            <div>
                <div className="relative flex min-h-[400px] flex-col items-center justify-center rounded-[2.5rem] border border-slate-200 bg-white/50 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="mb-6 text-center">
                        <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                            Phòng Thử Đồ
                        </h3>
                        <p className="text-xs text-slate-500">Xem trước khung viền trên avatar của bạn</p>
                    </div>

                    <div className="relative mb-6 group cursor-pointer">
                        {/* Avatar Preview - Smaller Size */}
                        <div className="relative h-32 w-32 transition-transform duration-500 group-hover:scale-110">
                            <FrameRenderer
                                fallbackImageUrl={generatedImage || undefined}
                                avatarUrl={userAvatarUrl}
                                className="h-full w-full drop-shadow-xl"
                            />

                            {/* Loading Overlay */}
                            {isGenerating && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/40 backdrop-blur-md z-50">
                                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                                </div>
                            )}
                        </div>

                        {/* Floor Reflection Effect */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-black/20 blur-lg rounded-[100%] opacity-40 transition-all duration-500 group-hover:w-20 group-hover:opacity-60" />
                    </div>

                    {generatedImage ? (
                        <div className="flex w-full max-w-sm gap-3 animate-in slide-in-from-bottom-5 fade-in duration-500">
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || isSaving}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Thử Lại
                            </button>
                            <button
                                onClick={handleSaveToShop}
                                disabled={isSaving}
                                className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70"
                            >
                                {isSaving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Lưu vào Shop
                            </button>
                        </div>
                    ) : (
                        <div className="text-center max-w-xs mx-auto">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-200 mb-4 dark:bg-slate-800">
                                <Sparkles className="w-6 h-6 text-slate-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-500">
                                Chưa có thiết kế nào
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                Chọn phong cách và nhấn "Tạo Khung" để bắt đầu phép thuật! ✨
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
