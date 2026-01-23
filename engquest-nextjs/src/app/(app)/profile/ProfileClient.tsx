"use client";

import { useMemo, useState, type FormEvent } from "react";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Activity, BookOpen, Pencil, Save, Target } from "lucide-react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { updateUserProfile, type UserProfile } from "@/actions/profile.actions";
import { getLevelProgress, getLevelTitle } from "@/lib/gamification";

const MediaUploader = dynamic(() => import("@/components/MediaUploader"), {
  ssr: false,
  loading: () => (
    <div className="h-52 w-full animate-pulse rounded-2xl border border-dashed border-slate-200 bg-slate-50" />
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
};

const numberFormatter = new Intl.NumberFormat("en-US");

const normalizeAccuracy = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  if (value <= 1) return Math.round(value * 100);
  return Math.round(value);
};

const buildFormState = (profile: UserProfile | null): ProfileFormState => ({
  displayName: profile?.displayName ?? profile?.name ?? "",
  bio: profile?.bio ?? "",
  avatarUrl: profile?.avatarUrl ?? "",
});

export default function ProfileClient({
  initialProfile,
  initialError = null,
}: ProfileClientProps) {
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [formState, setFormState] = useState<ProfileFormState>(() =>
    buildFormState(initialProfile)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const levelProgress = useMemo(() => {
    const xp = profile?.gamification?.xp ?? 0;
    return getLevelProgress(xp);
  }, [profile?.gamification?.xp]);
  const levelTitle = getLevelTitle(levelProgress.level);

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
    <main className="min-h-screen bg-slate-50/70 px-4 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">


        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <section className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 lg:w-[38%]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                  Hồ sơ cá nhân
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                  Thông tin cá nhân
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Cập nhật thông tin để cá nhân hóa trải nghiệm học tập.
                </p>
              </div>
              {profile && (
                <div className="flex flex-wrap items-center gap-2">
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <Pencil className="h-4 w-4" />
                      Chỉnh sửa
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void signOut({ callbackUrl: "/" })}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-5">
              {initialError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {initialError}
                </div>
              )}

              {!profile && !initialError && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                  Vui lòng đăng nhập để xem hồ sơ.
                </div>
              )}

              {profile && !isEditing && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={profile.avatarUrl || "/logo.png"}
                      alt={profile.displayName || profile.name}
                      width={80}
                      height={80}
                      sizes="80px"
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
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Giới thiệu
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {profile.bio || "Thêm vài dòng giới thiệu về bạn."}
                    </p>
                  </div>
                </div>
              )}

              {profile && isEditing && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
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
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
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
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
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
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
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
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Thống kê học tập
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Tổng quan tiến độ
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Tóm tắt hiệu suất học tập của bạn.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              {!profile && (
                <p className="text-sm text-slate-500">
                  Đăng nhập để xem tiến độ cấp độ.
                </p>
              )}

              {profile && (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                      Lv. {levelProgress.level} {levelTitle}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {numberFormatter.format(levelProgress.progress)} /{" "}
                      {numberFormatter.format(levelProgress.required)} XP
                    </span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-500"
                      style={{ width: `${levelProgress.percent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {numberFormatter.format(levelProgress.remaining)} XP để lên cấp
                    tiếp theo
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {!profile && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 sm:col-span-2 xl:col-span-3">
                  Chưa có dữ liệu thống kê.
                </div>
              )}

              {profile &&
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
      </div>
    </main>
  );
}
