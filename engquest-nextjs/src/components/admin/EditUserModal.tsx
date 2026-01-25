"use client";

import { useState } from "react";
import { UserListItem, updateUserAdmin } from "@/actions/user.actions";
import { X, Save, Shield, Ban, Coins, Trophy, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type EditUserModalProps = {
    user: UserListItem;
    onClose: () => void;
    onUpdate: () => void;
};

export default function EditUserModal({ user, onClose, onUpdate }: EditUserModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user.displayName || user.name,
        bio: user.bio || "",
        role: user.role,
        isBanned: user.isBanned,
        level: user.gamification.level,
        xp: user.gamification.xp,
        currency: user.gamification.currency,
    });

    const router = useRouter();

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateUserAdmin(user.id, {
                displayName: formData.displayName,
                bio: formData.bio,
                role: formData.role,
                isBanned: formData.isBanned,
                gamification: {
                    level: formData.level,
                    xp: formData.xp,
                    currency: formData.currency,
                },
            });
            toast.success("Cập nhật người dùng thành công!");
            onUpdate();
            onClose();
            router.refresh();
        } catch (error) {
            toast.error("Lỗi khi cập nhật người dùng.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
            <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                    <h2 className="text-xl font-bold text-slate-900">Chỉnh sửa người dùng</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-6">
                    {/* General Info */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Thông tin chung</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Tên hiển thị</label>
                            <input
                                type="text"
                                value={formData.displayName}
                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Bio / Giới thiệu</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={3}
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 resize-none"
                            />
                        </div>
                    </section>

                    {/* Account Status */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Trạng thái tài khoản</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setFormData({ ...formData, role: formData.role === "admin" ? "user" : "admin" })}
                                className={`flex items-center gap-3 rounded-xl border p-3 transition ${formData.role === "admin"
                                        ? "border-blue-200 bg-blue-50 text-blue-700"
                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <Shield className="h-5 w-5" />
                                <div className="text-left">
                                    <p className="text-xs font-bold">Quyền hạn</p>
                                    <p className="text-sm">{formData.role === "admin" ? "Admin" : "User"}</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setFormData({ ...formData, isBanned: !formData.isBanned })}
                                className={`flex items-center gap-3 rounded-xl border p-3 transition ${formData.isBanned
                                        ? "border-red-200 bg-red-50 text-red-700"
                                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    }`}
                            >
                                <Ban className="h-5 w-5" />
                                <div className="text-left">
                                    <p className="text-xs font-bold">Trạng thái</p>
                                    <p className="text-sm">{formData.isBanned ? "Đang bị cấm" : "Hoạt động"}</p>
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* Gamification */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Gamification</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {/* Level */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                    <Trophy className="h-3 w-3" /> Level
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-center font-bold"
                                />
                            </div>

                            {/* XP */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                    <Star className="h-3 w-3" /> XP
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.xp}
                                    onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) || 0 })}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-center font-bold"
                                />
                            </div>

                            {/* Currency */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                    <Coins className="h-3 w-3" /> Gems
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: parseInt(e.target.value) || 0 })}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-center font-bold"
                                />
                            </div>
                        </div>
                    </section>

                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-6 bg-slate-50">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70"
                    >
                        {loading ? "Đang lưu..." : (
                            <>
                                <Save className="h-4 w-4" /> Lưu thay đổi
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
