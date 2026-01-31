"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { generateAIFrame, saveAIFrameToShop } from "@/actions/ai-shop.actions";
import { FrameRenderer } from "@/components/shop/FrameRenderer";
import { Loader2, Save, RefreshCw, Wand2, Check, Sparkles, Zap, X, Coins } from "lucide-react";

type FrameGeneratorProps = {
    userAvatarUrl?: string;
};

const PROMPT_CHIPS = ["Neon", "Fire", "Gold", "Minimalist", "Cyberpunk", "Mystic", "Floral"];
const LOADING_STEPS = ["Analyzing Ether...", "Forging Geometry...", "Infusing Magic...", "Finalizing Art..."];

export default function FrameGenerator({ userAvatarUrl }: FrameGeneratorProps) {
    const [prompt, setPrompt] = useState("");
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, startGeneration] = useTransition();
    const [isSaving, startSaving] = useTransition();
    const [loadingStepIndex, setLoadingStepIndex] = useState(0);

    // Preview Context State
    const [previewContext, setPreviewContext] = useState<"dark" | "light" | "profile">("dark");

    // Save Modal State
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [saveData, setSaveData] = useState({
        name: "My Epic Frame",
        price: 100,
        rarity: "rare" as "common" | "rare" | "legendary"
    });

    // Cycle loading steps
    useEffect(() => {
        if (isGenerating) {
            const interval = setInterval(() => {
                setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
            }, 1200);
            return () => clearInterval(interval);
        } else {
            setLoadingStepIndex(0);
        }
    }, [isGenerating]);

    const handleChipClick = (chip: string) => {
        setPrompt((prev) => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${chip}` : chip;
        });
    };

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
                toast.error(result.message || "Có lỗi xảy ra khi tạo khung.");
            }
        });
    };

    const handleSaveToShop = () => {
        if (!generatedImage) return;
        setIsSaveModalOpen(true);
    };

    const confirmSave = () => {
        if (!saveData.name) {
            toast.error("Vui lòng đặt tên cho khung!");
            return;
        }

        startSaving(async () => {
            const result = await saveAIFrameToShop({
                name: saveData.name,
                imageUrl: generatedImage!,
                price: saveData.price,
                rarity: saveData.rarity,
            });

            if (result.success) {
                toast.success("Đã lưu khung vào Shop! 🛍️");
                setGeneratedImage(null);
                setPrompt("");
                setIsSaveModalOpen(false);
            } else {
                toast.error("Lỗi khi lưu vào Shop.");
            }
        });
    };

    // Rarity Colors Helper
    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case "legendary": return "border-amber-400 shadow-amber-500/20";
            case "rare": return "border-blue-500 shadow-blue-500/20";
            default: return "border-slate-500 shadow-slate-500/20";
        }
    };

    const getRarityText = (rarity: string) => {
        switch (rarity) {
            case "legendary": return "text-amber-400";
            case "rare": return "text-blue-400";
            default: return "text-slate-400";
        }
    };

    return (
        <div className="relative min-h-[600px] w-full overflow-hidden rounded-[2rem] bg-slate-950 p-6 lg:p-10 text-slate-200 shadow-2xl">
            {/* Background Grid Pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="relative z-10 grid gap-10 lg:grid-cols-2 lg:items-start">

                {/* --- LEFT PANEL: Controls --- */}
                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-indigo-400">
                            <Sparkles className="h-5 w-5 animate-pulse" />
                            <h2 className="text-xl font-bold tracking-tight text-white">AI Frame Studio</h2>
                        </div>
                        <p className="text-sm text-slate-400">
                            Nhập ý tưởng và để ma thuật tạo nên khung viền độc bản cho bạn.
                        </p>
                    </div>

                    {/* Glassmorphism Input Panel */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl transition-all focus-within:border-indigo-500/50 focus-within:bg-white/10">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Mô tả ý tưởng... (Ví dụ: Rồng lửa cuộn quanh, sấm sét tím...)"
                            className="h-40 w-full resize-none bg-transparent p-5 text-lg font-medium text-white placeholder:text-slate-500 focus:outline-none"
                            disabled={isGenerating}
                        />

                        {/* Prompt Chips */}
                        <div className="flex flex-wrap gap-2 px-4 pb-4">
                            {PROMPT_CHIPS.map(chip => (
                                <button
                                    key={chip}
                                    onClick={() => handleChipClick(chip)}
                                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors"
                                >
                                    + {chip}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt}
                        className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-indigo-600 px-6 py-5 font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                    >
                        {isGenerating ? (
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin text-white/80" />
                                    <span className="text-white/90">{LOADING_STEPS[loadingStepIndex]}</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
                                <Wand2 className="h-5 w-5" />
                                <span>Tạo Khung Ngay</span>
                            </>
                        )}
                    </button>
                </div>

                {/* --- RIGHT PANEL: Preview Stage --- */}
                <div className="flex flex-col gap-4">
                    {/* Context Toggles */}
                    <div className="flex justify-end pr-2">
                        <div className="flex rounded-lg bg-slate-900/50 p-1 ring-1 ring-white/10 backdrop-blur-md">
                            {(["dark", "light", "profile"] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setPreviewContext(mode)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${previewContext === mode
                                        ? "bg-slate-700 text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-300"
                                        }`}
                                >
                                    {mode === "dark" ? "Dark" : mode === "light" ? "Light" : "UI Mock"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Stage */}
                    <div className={`
                        relative flex min-h-[450px] flex-col items-center justify-center rounded-[2.5rem] border border-white/5 transition-all duration-500
                        ${previewContext === 'dark' ? 'bg-slate-900/40' : ''}
                        ${previewContext === 'light' ? 'bg-slate-200' : ''}
                        ${previewContext === 'profile' ? 'bg-slate-900 border-slate-800' : ''}
                    `}>

                        {/* Pedestal Spotlight (Only visible in Dark Mode for dramatic effect) */}
                        {previewContext === 'dark' && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
                        )}

                        {/* Profile UI Mockup Background (Optional) */}
                        {previewContext === 'profile' && (
                            <div className="absolute inset-0 px-6 py-12 opacity-30 pointer-events-none select-none">
                                <div className="h-4 w-1/3 bg-slate-700 rounded mb-8 mx-auto" />
                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-slate-800 rounded" />
                                    <div className="h-2 w-5/6 bg-slate-800 rounded" />
                                    <div className="h-2 w-4/6 bg-slate-800 rounded" />
                                </div>
                            </div>
                        )}

                        <div className="relative z-10 flex flex-col items-center">
                            {/* The Avatar Container */}
                            <div className="group relative">
                                <div className="relative h-40 w-40 transition-transform duration-500 hover:scale-105">
                                    <FrameRenderer
                                        fallbackImageUrl={generatedImage || undefined}
                                        avatarUrl={userAvatarUrl}
                                        className="h-full w-full"
                                    />
                                </div>

                                {/* Reflection */}
                                <div className="absolute -bottom-[1px] left-0 right-0 h-40 w-40 origin-bottom scale-y-[-1] opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none">
                                    <FrameRenderer
                                        fallbackImageUrl={generatedImage || undefined}
                                        avatarUrl={userAvatarUrl}
                                        className="h-full w-full grayscale blur-[1px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons (Only show when generated) */}
                        {generatedImage && (
                            <div className="absolute bottom-8 flex gap-3 animate-in slide-in-from-bottom-4 fade-in duration-700">
                                <button
                                    onClick={() => {
                                        setGeneratedImage(null);
                                        setPrompt("");
                                    }}
                                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
                                    title="Hủy / Làm lại"
                                >
                                    <RefreshCw className="h-5 w-5" />
                                </button>

                                <button
                                    onClick={handleSaveToShop}
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all"
                                >
                                    <Save className="h-5 w-5" />
                                    <span>Lưu vào Shop</span>
                                </button>
                            </div>
                        )}

                        {/* Empty State Hint */}
                        {!generatedImage && !isGenerating && (
                            <div className="absolute bottom-12 text-center text-slate-500">
                                <p className="text-sm">Chưa có thiết kế</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- SAVE MODAL --- */}
            {isSaveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className={`
                        w-full max-w-sm overflow-hidden rounded-3xl border-2 bg-slate-900 shadow-2xl transition-all
                        ${getRarityColor(saveData.rarity)}
                    `}>
                        {/* Header Image */}
                        <div className="relative h-32 w-full bg-slate-800/50 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
                            <div className="h-24 w-24 relative z-10">
                                <FrameRenderer
                                    fallbackImageUrl={generatedImage || undefined}
                                    avatarUrl={userAvatarUrl}
                                    className="h-full w-full drop-shadow-lg"
                                />
                            </div>
                            <button onClick={() => setIsSaveModalOpen(false)} className="absolute top-3 right-3 p-1 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Tên Vật Phẩm</label>
                                <input
                                    type="text"
                                    value={saveData.name}
                                    onChange={e => setSaveData({ ...saveData, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Độ Hiếm</label>
                                    <select
                                        value={saveData.rarity}
                                        onChange={e => setSaveData({ ...saveData, rarity: e.target.value as "common" | "rare" | "legendary" })}
                                        className={`w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 font-bold focus:border-indigo-500 focus:outline-none capitalize ${getRarityText(saveData.rarity)}`}
                                    >
                                        <option value="common">Common</option>
                                        <option value="rare">Rare</option>
                                        <option value="legendary">Legendary</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Giá Bán</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400">
                                            <Coins className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="number"
                                            value={saveData.price}
                                            onChange={e => setSaveData({ ...saveData, price: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-3 text-white font-bold focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={confirmSave}
                                disabled={isSaving}
                                className="w-full py-4 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                            >
                                {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                Xác nhận Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
