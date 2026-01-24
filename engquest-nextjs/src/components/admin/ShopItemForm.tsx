"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createShopItem, updateShopItem, type ShopItemFormData } from "@/actions/admin/shop.actions";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { FrameRenderer } from "@/lib/frame-registry";

interface ShopItemFormProps {
    initialData?: ShopItemFormData & { _id: string };
    isEditMode?: boolean;
}

export default function ShopItemForm({ initialData, isEditMode = false }: ShopItemFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ShopItemFormData>({
        name: initialData?.name || "",
        type: initialData?.type || "frame",
        imageUrl: initialData?.imageUrl || "/frames/gold.png",
        price: initialData?.price || 0,
        rarity: initialData?.rarity || "common",
        renderKey: initialData?.renderKey || "",
        isActive: initialData?.isActive ?? true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : name === "price" ? Number(value) : value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, isActive: e.target.checked }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let result;
            if (isEditMode && initialData) {
                result = await updateShopItem(initialData._id, formData);
            } else {
                result = await createShopItem(formData);
            }

            if (result.success) {
                toast.success(result.message);
                router.push("/admin/shop");
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/shop" className="p-2 rounded-full hover:bg-slate-100 transition">
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">
                    {isEditMode ? "Chỉnh sửa vật phẩm" : "Thêm vật phẩm mới"}
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 items-start">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Tên vật phẩm</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                                placeholder="Ví dụ: Khung Vàng"
                            />
                        </div>

                        {/* Type & Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Loại</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                                >
                                    <option value="frame">Khung Hồ Sơ</option>
                                    <option value="avatar">Ảnh Đại Diện</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Giá (Gems)</label>
                                <input
                                    name="price"
                                    type="number"
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                                />
                            </div>
                        </div>

                        {/* Rarity */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Độ hiếm</label>
                            <select
                                name="rarity"
                                value={formData.rarity}
                                onChange={handleChange}
                                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                            >
                                <option value="common">Common (Thường)</option>
                                <option value="rare">Rare (Hiếm)</option>
                                <option value="legendary">Legendary (Huyền thoại)</option>
                            </select>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">URL Hình ảnh (Placeholder/Fallback)</label>
                            <input
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                required
                                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                                placeholder="/frames/my-frame.png"
                            />
                        </div>

                        {/* Render Key */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Render Key (SVG Animation - Optional)</label>
                            <input
                                name="renderKey"
                                value={formData.renderKey}
                                onChange={handleChange}
                                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                                placeholder="tech-svg, mystic-svg..."
                            />
                            <p className="text-xs text-slate-500 mt-1">Để trống nếu dùng ảnh tĩnh.</p>
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Đang hoạt động (Hiển thị trong Shop)</label>
                        </div>

                    </div>

                    <div className="flex justify-end gap-3">
                        <Link href="/admin/shop" className="px-6 py-2.5 rounded-full border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition">
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isEditMode ? "Lưu thay đổi" : "Tạo vật phẩm"}
                        </button>
                    </div>
                </form>

                {/* Live Preview */}
                <div className="sticky top-24">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Xem trước</h3>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                        <div className="relative w-32 h-32 mb-4 bg-slate-50 rounded-xl flex items-center justify-center">
                            <FrameRenderer
                                frameKey={formData.renderKey}
                                fallbackImageUrl={formData.imageUrl}
                                className="w-full h-full"
                            />
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg text-center">{formData.name || "Tên vật phẩm"}</h4>
                        <p className="text-sm text-slate-500 capitalize mb-2">{formData.type}</p>
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border mb-3
                    ${formData.rarity === 'legendary' ? 'text-purple-600 border-purple-200 bg-purple-50' :
                                formData.rarity === 'rare' ? 'text-blue-600 border-blue-200 bg-blue-50' :
                                    'text-slate-600 border-slate-200 bg-slate-50'
                            }`}>
                            {formData.rarity}
                        </div>
                        <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md shadow-slate-900/20">
                            {formData.price} Gems
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 text-center mt-4">
                        Hình ảnh hiển thị thực tế có thể khác tùy thuộc vào dữ liệu.
                    </p>
                </div>
            </div>
        </div>
    );
}
