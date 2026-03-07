"use client";
// Admin profile summary card shown in the user-management area.

import { useMemo, useState } from "react";
import { UserProfile, updateUserProfile } from "@/actions/user/profile.actions";
import { getLevelProgress, getLevelTitle } from "@/lib/gamification/gamification";
import { FrameRenderer } from "@/components/shop/FrameRenderer";
import dynamic from "next/dynamic";
import InventoryModal from "@/components/shop/InventoryModal";
import toast from "react-hot-toast";
import { Pencil, Camera, Save, X } from "lucide-react";
import type { ShopVisualItem } from "@/types/shop-item";

const MediaUploader = dynamic(() => import("@/components/common/MediaUploader"), {
    ssr: false,
    loading: () => null,
});

type AdminProfileCardProps = {
    profile: UserProfile;
    shopItems?: ShopVisualItem[];
};

const numberFormatter = new Intl.NumberFormat("en-US");

export default function AdminProfileCard({
    profile: initialProfile,
    shopItems = [],
}: AdminProfileCardProps) {
    const [profile, setProfile] = useState(initialProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Local state for editing form
    const [editForm, setEditForm] = useState({
        displayName: initialProfile.displayName,
        avatarUrl: initialProfile.avatarUrl,
    });

    const levelProgress = useMemo(() => {
        const xp = profile.gamification.xp ?? 0;
        return getLevelProgress(xp);
    }, [profile.gamification.xp]);

    const levelTitle = getLevelTitle(levelProgress.level);

    const equippedFrameItem = useMemo(() => {
        const frameId = profile.gamification.equippedFrame;
        return frameId ? shopItems.find((i) => i._id === frameId) : null;
    }, [profile.gamification.equippedFrame, shopItems]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = new FormData();
            payload.append("displayName", editForm.displayName);
            payload.append("avatarUrl", editForm.avatarUrl);

            const result = await updateUserProfile(payload);
            if (result.success && result.data) {
                setProfile(result.data);
                setIsEditing(false);
                toast.success("Hồ sơ admin đã cập nhật!");
            } else {
                throw new Error(result.message || "Cập nhật thất bại");
            }
        } catch {
            toast.error("Không thể lưu thay đổi.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditForm({
            displayName: profile.displayName,
            avatarUrl: profile.avatarUrl,
        });
        setIsEditing(false);
    };

    return (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/20">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/3 rounded-full bg-slate-100 opacity-50 blur-2xl dark:bg-slate-800" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                    <div className="group relative h-28 w-28">
                        <FrameRenderer
                            frameKey={equippedFrameItem?.renderKey}
                            fallbackImageUrl={equippedFrameItem?.imageUrl}
                            avatarUrl={isEditing ? editForm.avatarUrl : profile.avatarUrl}
                            className="h-full w-full"
                        />

                        {/* Quick Actions Overlay (only when not editing mode, allows opening Inventory) */}
                        {!isEditing && (
                            <InventoryModal
                                inventoryItems={shopItems.filter(item => profile.gamification.inventory.includes(item._id))}
                                equippedFrame={profile.gamification.equippedFrame}
                                equippedAvatar={profile.gamification.equippedAvatar}
                                trigger={
                                    <button className="absolute bottom-0 right-0 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-slate-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400">
                                        <Camera className="h-4 w-4" />
                                    </button>
                                }
                            />
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <input
                                        value={editForm.displayName}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                                        className="rounded-xl border border-slate-300 px-3 py-1 text-xl font-bold text-slate-900 focus:border-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.displayName}</h2>
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">ADMIN</span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <span>Lv. {levelProgress.level} {levelTitle}</span>
                                <span>•</span>
                                <span>{profile.email}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex h-9 items-center gap-2 rounded-full bg-slate-900 px-4 text-xs font-bold text-white shadow-md hover:bg-slate-800 disabled:opacity-70 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                                    >
                                        <Save className="h-4 w-4" />
                                        {isSaving ? "Lưu..." : "Lưu"}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Sửa
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Level Progress */}
                    <div className="max-w-md">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <span>{numberFormatter.format(levelProgress.progress)} XP</span>
                            <span>{numberFormatter.format(levelProgress.required)} XP</span>
                        </div>
                        <div className="mt-2 h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transition-all duration-500"
                                style={{ width: `${levelProgress.percent}%` }}
                            />
                        </div>
                        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                            Còn {numberFormatter.format(levelProgress.remaining)} XP để đạt cấp {levelProgress.level + 1}
                        </p>
                    </div>

                    {/* Avatar Upload (Only visible when editing) */}
                    {isEditing && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Đổi Avatar</p>
                            <MediaUploader
                                mediaType="image"
                                initialValue={editForm.avatarUrl}
                                onUploadComplete={(url) => setEditForm(prev => ({ ...prev, avatarUrl: url }))}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
