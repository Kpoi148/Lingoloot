// Modal form for pricing and saving a generated frame into the shop catalog.
import { Coins, Loader2, Save, X } from "lucide-react";
import { FrameRenderer } from "@/components/shop/FrameRenderer";
import type { FrameRarity, FrameSaveData } from "@/components/admin/ai-hub/frame-generator/types";
import {
  getRarityColor,
  getRarityText,
} from "@/components/admin/ai-hub/frame-generator/utils";

type FrameSaveModalProps = {
  generatedImage: string | null;
  isOpen: boolean;
  isSaving: boolean;
  saveData: FrameSaveData;
  userAvatarUrl?: string;
  onClose: () => void;
  onConfirm: () => void;
  onNameChange: (value: string) => void;
  onPriceChange: (value: number) => void;
  onRarityChange: (rarity: FrameRarity) => void;
};

export default function FrameSaveModal({
  generatedImage,
  isOpen,
  isSaving,
  saveData,
  userAvatarUrl,
  onClose,
  onConfirm,
  onNameChange,
  onPriceChange,
  onRarityChange,
}: FrameSaveModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`
          w-full max-w-sm overflow-hidden rounded-3xl border-2 bg-slate-900 shadow-2xl transition-all
          ${getRarityColor(saveData.rarity)}
        `}
      >
        <div className="relative flex h-32 w-full items-center justify-center overflow-hidden bg-slate-800/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
          <div className="relative z-10 h-24 w-24">
            <FrameRenderer
              fallbackImageUrl={generatedImage || undefined}
              avatarUrl={userAvatarUrl}
              className="h-full w-full drop-shadow-lg"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-black/20 p-1 text-white transition-colors hover:bg-black/40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Tên Vật Phẩm
            </label>
            <input
              type="text"
              value={saveData.name}
              onChange={(event) => onNameChange(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-bold text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Độ Hiếm
              </label>
              <select
                value={saveData.rarity}
                onChange={(event) =>
                  onRarityChange(event.target.value as FrameRarity)
                }
                className={`w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 font-bold capitalize focus:border-indigo-500 focus:outline-none ${getRarityText(
                  saveData.rarity
                )}`}
              >
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Giá Bán
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400">
                  <Coins className="h-4 w-4" />
                </div>
                <input
                  type="number"
                  value={saveData.price}
                  onChange={(event) =>
                    onPriceChange(Number.parseInt(event.target.value, 10) || 0)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-9 pr-3 font-bold text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 active:scale-[0.98]"
          >
            {isSaving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            Xác nhận Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
