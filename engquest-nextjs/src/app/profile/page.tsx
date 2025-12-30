"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BookOpen, Pencil, Save, Target } from "lucide-react";
import toast from "react-hot-toast";
import MediaUploader from "@/components/MediaUploader";
import {
  getUserProfile,
  updateUserProfile,
  type UserProfile,
} from "@/actions/profile.actions";

type ProfileFormState = {
  displayName: string;
  bio: string;
  avatarUrl: string;
};

const numberFormatter = new Intl.NumberFormat("en-US");

const normalizeAccuracy = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  if (value <= 1) return Math.round(value * 100);
  return Math.round(value);
};

const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-2xl bg-slate-100 ${className}`} />
);

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formState, setFormState] = useState<ProfileFormState>({
    displayName: "",
    bio: "",
    avatarUrl: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getUserProfile();
        if (!active) return;
        setProfile(data);
        setFormState({
          displayName: data?.displayName ?? data?.name ?? "",
          bio: data?.bio ?? "",
          avatarUrl: data?.avatarUrl ?? "",
        });
      } catch (error) {
        if (active) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể tải thông tin hồ sơ."
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    if (!profile) return [];
    return [
      {
        label: "Tổng từ đã thêm",
        value: numberFormatter.format(profile.stats.totalVocabAdded),
        icon: BookOpen,
        accent: "bg-emerald-50 text-emerald-600",
      },
      {
        label: "Độ chính xác Quiz",
        value: `${normalizeAccuracy(profile.stats.quizAccuracy)}%`,
        icon: Target,
        accent: "bg-sky-50 text-sky-600",
      },
      {
        label: "Số Quiz đã làm",
        value: numberFormatter.format(profile.stats.quizzesTaken),
        icon: Activity,
        accent: "bg-amber-50 text-amber-600",
      },
    ];
  }, [profile]);

  const handleCancel = () => {
    setIsEditing(false);
    setFormState({
      displayName: profile?.displayName ?? profile?.name ?? "",
      bio: profile?.bio ?? "",
      avatarUrl: profile?.avatarUrl ?? "",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      setFormState({
        displayName: updatedProfile.displayName ?? updatedProfile.name ?? "",
        bio: updatedProfile.bio ?? "",
        avatarUrl: updatedProfile.avatarUrl ?? "",
      });
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
    <main className="min-h-screen bg-slate-50/70 px-4 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
        <section className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 lg:w-[38%]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Hồ sơ cá nhân
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                Thông tin cá nhân
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Cập nhật thông tin để cá nhân hóa trải nghiệm học tập.
              </p>
            </div>
            {!isLoading && profile && !isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Pencil className="h-4 w-4" />
                Chỉnh sửa
              </button>
            )}
          </div>

          <div className="mt-6 space-y-5">
            {isLoading && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <SkeletonBlock className="h-20 w-20 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-40" />
                    <SkeletonBlock className="h-4 w-56" />
                  </div>
                </div>
                <SkeletonBlock className="h-20 w-full" />
                <SkeletonBlock className="h-10 w-32" />
              </div>
            )}

            {!isLoading && !profile && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                Vui lòng đăng nhập để xem hồ sơ.
              </div>
            )}

            {!isLoading && profile && !isEditing && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={profile.avatarUrl || "/logo.png"}
                    alt={profile.displayName || profile.name}
                    className="h-20 w-20 rounded-full border border-slate-200 object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {profile.displayName || profile.name}
                    </p>
                    <p className="text-sm text-slate-500">{profile.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Giới thiệu
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {profile.bio || "Thêm vài dòng giới thiệu về bạn."}
                  </p>
                </div>
              </div>
            )}

            {!isLoading && profile && isEditing && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
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
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
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
                    className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700"
                    placeholder="Tên của bạn"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Email (chỉ đọc)
                  </label>
                  <input
                    value={profile.email}
                    readOnly
                    disabled
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
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
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
                    placeholder="Chia sẻ mục tiêu học tập của bạn..."
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        <section className="flex w-full flex-1 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Thống kê học tập
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Tổng quan tiến độ
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Tóm tắt hiệu suất học tập của bạn.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`stat-skeleton-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <SkeletonBlock className="h-10 w-10 rounded-2xl" />
                  <SkeletonBlock className="mt-4 h-6 w-24" />
                  <SkeletonBlock className="mt-2 h-4 w-32" />
                </div>
              ))}

            {!isLoading && !profile && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 sm:col-span-2 xl:col-span-3">
                Chưa có dữ liệu thống kê.
              </div>
            )}

            {!isLoading &&
              profile &&
              stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl ${item.accent}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-3xl font-semibold text-slate-900">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{item.label}</p>
                  </div>
                );
              })}
          </div>
        </section>
      </div>
    </main>
  );
}
