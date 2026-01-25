import { getUserProfile } from "@/actions/profile.actions";
import { getAdminShopItems } from "@/actions/admin/shop.actions";
import AdminProfileCard from "@/components/admin/AdminProfileCard";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
    const profile = await getUserProfile();
    const shopItems = await getAdminShopItems();

    if (!profile) {
        return (
            <div className="flex h-96 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50">
                <p className="text-slate-500">Không tìm thấy thông tin quản trị viên.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Hồ sơ quản trị</h1>
                <p className="text-sm text-slate-500">Quản lý thông tin cá nhân và giao diện hiển thị.</p>
            </div>

            <AdminProfileCard profile={profile} shopItems={shopItems} />
        </div>
    );
}
