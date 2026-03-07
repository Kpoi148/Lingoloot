// Admin page for browsing and maintaining shop inventory.
import { getAdminShopItems, toggleShopItemStatus } from "@/actions/admin/shop.actions";
import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import DeleteShopItemButton from "@/components/admin/shop/DeleteShopItemButton";
import RestoreDefaultsButton from "@/components/admin/shop/RestoreDefaultsButton";
import ShopItemPreview from "@/components/admin/shop/ShopItemPreview";

export default async function AdminShopPage() {
    const items = await getAdminShopItems();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Quản lý Cửa Hàng</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Danh sách các vật phẩm đang bán</p>
                </div>
                <div className="flex gap-2">
                    <RestoreDefaultsButton />
                    <Link
                        href="/admin/shop-management/create"
                        className="flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 hover:-translate-y-0.5"
                    >
                        <Plus className="h-4 w-4" />
                        Thêm vật phẩm
                    </Link>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/20">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                    <thead className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                        <tr>
                            <th className="px-6 py-4">Hình ảnh</th>
                            <th className="px-6 py-4">Tên vật phẩm</th>
                            <th className="px-6 py-4">Loại</th>
                            <th className="px-6 py-4">Giá</th>
                            <th className="px-6 py-4">Độ hiếm</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500">
                                    Chưa có vật phẩm nào.
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item._id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                    <td className="px-6 py-4">
                                        <ShopItemPreview item={item} />
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-200">{item.name}</td>
                                    <td className="px-6 py-4 capitalize">{item.type === 'frame' ? 'Khung' : 'Avatar'}</td>
                                    <td className="px-6 py-4 font-mono font-medium text-emerald-600 dark:text-emerald-400">{item.price} 💎</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border
                      ${item.rarity === 'legendary' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' :
                                                    item.rarity === 'rare' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' :
                                                        'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}
                                        >
                                            {item.rarity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${item.isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
                                        >
                                            {item.isActive ? 'Hoạt động' : 'Đang ẩn'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Toggle Status Form */}
                                            <form action={async () => {
                                                "use server";
                                                await toggleShopItemStatus(item._id, !item.isActive);
                                            }}>
                                                <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition dark:hover:bg-slate-800 dark:hover:text-slate-300" title={item.isActive ? "Ẩn" : "Hiện"}>
                                                    {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                            </form>

                                            <Link
                                                href={`/admin/shop-management/${item._id}`}
                                                className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                                                title="Chỉnh sửa"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>


                                            {/* Delete Button (Client Component) */}
                                            <DeleteShopItemButton itemId={item._id} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
