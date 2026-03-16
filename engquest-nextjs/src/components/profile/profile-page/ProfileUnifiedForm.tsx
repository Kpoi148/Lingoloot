"use client";

import {
  Flame,
  Gem,
  LogOut,
  RotateCcw,
  Save,
  Shirt,
  Sparkles,
  Target,
} from "lucide-react";

import InventoryModal from "@/components/shop/InventoryModal";
import { FrameRenderer } from "@/components/shop/FrameRenderer";
import {
  formatNumber,
  getProfileDisplayName,
  normalizeAccuracy,
} from "./utils";
import type { ProfileUnifiedFormProps } from "./types";

type SummaryItem = {
  label: string;
  value: string;
  note: string;
  icon: typeof Flame;
  accentClassName: string;
};

export function ProfileUnifiedForm({
  profile,
  formState,
  inventorySummary,
  levelProgress,
  levelTitle,
  isSaving,
  onReset,
  onSignOut,
  onSubmit,
  onFieldChange,
}: ProfileUnifiedFormProps) {
  const displayName = getProfileDisplayName(profile);
  const summaryItems: SummaryItem[] = [
    {
      label: "Chuỗi ngày",
      value: formatNumber(profile.gamification.streak),
      note: "ngày liên tiếp",
      icon: Flame,
      accentClassName:
        "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    },
    {
      label: "Ngọc",
      value: formatNumber(profile.gamification.currency),
      note: "sẵn sàng mua đồ",
      icon: Gem,
      accentClassName:
        "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300",
    },
    {
      label: "Quiz",
      value: `${normalizeAccuracy(profile.stats.quizAccuracy)}%`,
      note: "độ chính xác",
      icon: Target,
      accentClassName:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    },
    {
      label: "Kho đồ",
      value: formatNumber(inventorySummary.inventoryCount),
      note: "vật phẩm sở hữu",
      icon: Sparkles,
      accentClassName:
        "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
    },
  ];

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[32px] border border-slate-900/10 bg-white/82 p-6 shadow-[0_35px_120px_-64px_rgba(15,23,42,0.55)] backdrop-blur dark:border-white/10 dark:bg-slate-950/82 md:p-8"
    >
      <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div className="rounded-[28px] bg-gradient-to-br from-amber-100 via-white to-sky-100 p-5 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.7)] dark:from-amber-500/14 dark:via-slate-900 dark:to-sky-500/12">
            <div className="mx-auto h-36 w-36 rounded-[32px] bg-white/70 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:bg-slate-950/60">
              <FrameRenderer
                frameKey={profile.gamification.equippedFrameDetails?.renderKey}
                fallbackImageUrl={profile.gamification.equippedFrameDetails?.imageUrl}
                avatarUrl={formState.avatarUrl || profile.avatarUrl || "/logo.png"}
                className="h-full w-full"
              />
            </div>

            <div className="mt-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-content-muted">
                Hồ sơ
              </p>
              <input
                value={formState.displayName}
                onChange={(event) =>
                  onFieldChange("displayName", event.target.value)
                }
                className="mt-3 w-full bg-transparent text-center text-2xl font-semibold text-content outline-none placeholder:text-content/55"
                placeholder={displayName}
              />
              <p className="mt-2 text-sm text-content-secondary">{profile.email}</p>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
                Lv. {profile.gamification.level}
              </span>
              <span className="rounded-full border border-slate-900/10 bg-white/72 px-3 py-1 text-xs font-semibold text-content-secondary dark:border-white/10 dark:bg-slate-950/60">
                {levelTitle}
              </span>
            </div>

            <textarea
              value={formState.bio}
              onChange={(event) => onFieldChange("bio", event.target.value)}
              rows={3}
              className="mt-4 w-full rounded-[20px] border border-slate-900/10 bg-white/78 px-4 py-3 text-sm leading-7 text-content outline-none transition focus:border-slate-900/20 dark:border-white/10 dark:bg-slate-950/70 dark:focus:border-white/20"
              placeholder="Thêm giới thiệu ngắn gọn nếu cần..."
            />
          </div>

          <div className="space-y-3 rounded-[28px] border border-slate-900/10 bg-white/70 p-4 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.6)] dark:border-white/10 dark:bg-slate-950/60">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-content-muted">
              Giao diện hiện tại
            </p>
            <div className="space-y-2 text-sm text-content-secondary">
              <p>
                Khung:{" "}
                <span className="font-semibold text-content">
                  {inventorySummary.equippedFrameItem?.name || "Khung mặc định"}
                </span>
              </p>
              <p>
                Avatar vật phẩm:{" "}
                <span className="font-semibold text-content">
                  {inventorySummary.equippedAvatarItem?.name || "Avatar mặc định"}
                </span>
              </p>
            </div>

            <InventoryModal
              inventoryItems={inventorySummary.ownedItems}
              equippedFrame={profile.gamification.equippedFrame}
              equippedAvatar={profile.gamification.equippedAvatar}
              trigger={
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-900/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-content-secondary transition hover:-translate-y-0.5 hover:text-content dark:border-white/10 dark:bg-slate-950/70"
                >
                  <Shirt className="h-4 w-4" />
                  Mở kho đồ
                </button>
              }
            />
          </div>
        </aside>

        <div className="space-y-6">
          <div className="rounded-[28px] bg-slate-900 p-5 text-white shadow-[0_28px_70px_-44px_rgba(15,23,42,1)] dark:bg-slate-800">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                  Tiến độ cấp độ
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900">
                    Lv. {levelProgress.level}
                  </span>
                  <span className="text-sm font-semibold text-white/85">
                    {formatNumber(levelProgress.progress)} /{" "}
                    {formatNumber(levelProgress.required)} XP
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/70">
                {formatNumber(levelProgress.remaining)} XP nữa để lên cấp tiếp theo
              </p>
            </div>

            <div className="mt-4 h-3 w-full rounded-full bg-white/12">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-500"
                style={{ width: `${levelProgress.percent}%` }}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summaryItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-slate-900/10 bg-white/72 p-4 shadow-[0_18px_45px_-36px_rgba(15,23,42,0.75)] backdrop-blur dark:border-white/10 dark:bg-slate-950/60"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${item.accentClassName}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-content">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-content-secondary">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-content-muted">
                    {item.note}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-900/8 pt-6 dark:border-white/8">
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-content-secondary transition hover:-translate-y-0.5 hover:text-content dark:border-white/10 dark:bg-slate-950/70"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-content-secondary transition hover:-translate-y-0.5 hover:text-content dark:border-white/10 dark:bg-slate-950/70"
          >
            <RotateCcw className="h-4 w-4" />
            Đặt lại
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_22px_55px_-32px_rgba(15,23,42,0.95)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </form>
  );
}
