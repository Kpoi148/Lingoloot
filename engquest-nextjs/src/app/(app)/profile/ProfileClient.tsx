"use client";
// Client-side profile surface for editing learner info and managing equipped cosmetics.

import { AlertCircle, LockKeyhole } from "lucide-react";

import { ProfileUnifiedForm } from "@/components/profile/profile-page/ProfileUnifiedForm";
import type { ProfileClientProps } from "@/components/profile/profile-page/types";
import { useProfilePageController } from "@/components/profile/profile-page/useProfilePageController";

export default function ProfileClient({
  initialProfile,
  initialError = null,
  shopItems = [],
}: ProfileClientProps) {
  const {
    profile,
    formState,
    isSaving,
    inventorySummary,
    levelProgress,
    levelTitle,
    handleFieldChange,
    handleResetForm,
    handleSubmit,
    handleSignOut,
  } = useProfilePageController(initialProfile, shopItems);

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-page px-4 py-10 text-content">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_30%)]" />

      <div className="relative mx-auto w-full max-w-5xl space-y-6">
        {initialError && (
          <section className="rounded-[28px] border border-red-500/20 bg-red-50/90 p-5 text-sm text-red-700 shadow-[0_25px_70px_-50px_rgba(239,68,68,0.8)] backdrop-blur dark:border-red-500/20 dark:bg-red-950/40 dark:text-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Không thể tải hồ sơ.</p>
                <p className="mt-1">{initialError}</p>
              </div>
            </div>
          </section>
        )}

        {!profile && !initialError && (
          <section className="rounded-[32px] border border-dashed border-slate-900/12 bg-white/78 p-8 text-center shadow-[0_30px_100px_-60px_rgba(15,23,42,0.5)] backdrop-blur dark:border-white/12 dark:bg-slate-950/76">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold text-content">
              Đăng nhập để mở hồ sơ
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-content-secondary">
              Trang này hiển thị thông tin cá nhân, tiến độ học tập và kho đồ giao
              diện, nên bạn cần đăng nhập để tiếp tục.
            </p>
          </section>
        )}

        {profile && (
          <ProfileUnifiedForm
            profile={profile}
            formState={formState}
            inventorySummary={inventorySummary}
            levelProgress={levelProgress}
            levelTitle={levelTitle}
            isSaving={isSaving}
            onReset={handleResetForm}
            onSignOut={handleSignOut}
            onSubmit={handleSubmit}
            onFieldChange={handleFieldChange}
          />
        )}
      </div>
    </main>
  );
}
