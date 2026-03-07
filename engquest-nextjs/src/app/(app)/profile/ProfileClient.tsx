"use client";
// Client-side profile surface for editing learner info and managing equipped cosmetics.

import { useState, type FormEvent } from "react";

import dynamic from "next/dynamic";
import { Pencil, Save, Shirt } from "lucide-react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { updateUserProfile, type UserProfile } from "@/actions/user/profile.actions";
import InventoryModal from "@/components/shop/InventoryModal";
import { FrameRenderer } from "@/components/shop/FrameRenderer";
import ProfileStats from "@/components/profile/ProfileStats";
import type { ShopCatalogItem } from "@/types/shop-item";

const MediaUploader = dynamic(() => import("@/components/common/MediaUploader"), {
  ssr: false,
  loading: () => (
    <div className="h-52 w-full animate-pulse rounded-2xl border border-dashed border-edge bg-surface-muted" />
  ),
});

type ProfileFormState = {
  displayName: string;
  bio: string;
  avatarUrl: string;
};

type ProfileClientProps = {
  initialProfile: UserProfile | null;
  initialError?: string | null;
  shopItems?: ShopCatalogItem[];
};

const buildFormState = (profile: UserProfile | null): ProfileFormState => ({
  displayName: profile?.displayName ?? profile?.name ?? "",
  bio: profile?.bio ?? "",
  avatarUrl: profile?.avatarUrl ?? "",
});

export default function ProfileClient({
  initialProfile,
  initialError = null,
  shopItems = [],
}: ProfileClientProps) {
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [formState, setFormState] = useState<ProfileFormState>(() =>
    buildFormState(initialProfile)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCancel = () => {
    setIsEditing(false);
    setFormState(buildFormState(profile));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    try {
      const payload = new FormData();
      const nameValue = formState.displayName.trim();
      if (nameValue) {
        payload.append("name", nameValue);
        payload.append("displayName", nameValue);
      }
      payload.append("bio", formState.bio);
      payload.append("avatarUrl", formState.avatarUrl);

      const result = await updateUserProfile(payload);
      if (!result.success) {
        throw new Error(result.message ?? "Cập nhật thất bại.");
      }

      const updatedProfile = result.data ?? profile;
      setProfile(updatedProfile);
      setFormState(buildFormState(updatedProfile));
      setIsEditing(false);
      toast.success("Đã cập nhật hồ sơ.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật hồ sơ."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-page px-4 py-10 text-content">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">


        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <section className="w-full rounded-3xl border border-edge bg-surface-card p-6 shadow-lg shadow-shadow-theme lg:w-[38%]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-content-muted">
                  Hồ sơ cá nhân
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-content">
                  Thông tin cá nhân
                </h1>
                <p className="mt-2 text-sm text-content-secondary">
                  Cập nhật thông tin để cá nhân hóa trải nghiệm học tập.
                </p>
              </div>
              {profile && (
                <div className="flex flex-wrap items-center gap-2">
                  <InventoryModal
                    inventoryItems={shopItems.filter(item => profile.gamification.inventory.includes(item._id))}
                    equippedFrame={profile.gamification.equippedFrame}
                    equippedAvatar={profile.gamification.equippedAvatar}
                    trigger={
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface-card px-4 py-2 text-xs font-semibold text-content-secondary shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <Shirt className="h-4 w-4" />
                        Giao diện
                      </button>
                    }
                  />
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface-card px-4 py-2 text-xs font-semibold text-content-secondary shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <Pencil className="h-4 w-4" />
                      Chỉnh sửa
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void signOut({ callbackUrl: "/" })}
                    className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface-card px-4 py-2 text-xs font-semibold text-content-secondary shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-5">
              {initialError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800/50 dark:bg-red-950/50 dark:text-red-400">
                  {initialError}
                </div>
              )}

              {!profile && !initialError && (
                <div className="rounded-2xl border border-dashed border-edge bg-surface-muted p-6 text-sm text-content-muted">
                  Vui lòng đăng nhập để xem hồ sơ.
                </div>
              )}

              {profile && !isEditing && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 flex-shrink-0">
                      {(() => {
                        const equippedFrameId = profile.gamification.equippedFrame;
                        const equippedFrameItem = equippedFrameId
                          ? shopItems.find(i => i._id === equippedFrameId)
                          : null;

                        return (
                          <FrameRenderer
                            frameKey={equippedFrameItem?.renderKey}
                            fallbackImageUrl={equippedFrameItem?.imageUrl}
                            avatarUrl={profile.avatarUrl || "/logo.png"}
                            className="h-full w-full"
                          />
                        );
                      })()}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-content">
                        {profile.displayName || profile.name}
                      </p>
                      <p className="text-sm text-content-muted">{profile.email}</p>
                    </div>


                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-content-muted">
                      Giới thiệu
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-content-secondary">
                      {profile.bio || "Thêm vài dòng giới thiệu về bạn."}
                    </p>
                  </div>
                </div>
              )}

              {profile && isEditing && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-content-muted">
                      Ảnh đại diện
                    </label>
                    <MediaUploader
                      mediaType="image"
                      initialValue={formState.avatarUrl}
                      onUploadComplete={(url) =>
                        setFormState((prev) => ({ ...prev, avatarUrl: url }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-content-muted">
                      Tên hiển thị
                    </label>
                    <input
                      value={formState.displayName}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          displayName: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-2xl border border-edge bg-surface-card px-4 text-sm text-content"
                      placeholder="Tên của bạn"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-content-muted">
                      Email (chỉ đọc)
                    </label>
                    <input
                      value={profile.email}
                      readOnly
                      disabled
                      className="h-11 w-full rounded-2xl border border-edge bg-surface-muted px-4 text-sm text-content-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-content-muted">
                      Giới thiệu
                    </label>
                    <textarea
                      value={formState.bio}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          bio: event.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full rounded-2xl border border-edge bg-surface-card px-4 py-3 text-sm text-content"
                      placeholder="Chia sẻ mục tiêu học tập của bạn..."
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded-full border border-edge bg-surface-card px-4 py-2 text-sm font-semibold text-content-secondary shadow-sm"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          <ProfileStats
            stats={profile?.stats}
            gamification={profile?.gamification}
          />
        </div>
      </div>
    </main>
  );
}
