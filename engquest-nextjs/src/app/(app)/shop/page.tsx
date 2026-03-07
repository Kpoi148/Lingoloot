// Learner shop page for spending Gems on profile cosmetics and rewards.
import { getShopItems } from "@/actions/user/shop.actions";
import { getUserProfile } from "@/actions/user/profile.actions";
import ShopClient from "@/components/shop/ShopClient";
import { ShoppingBag } from "lucide-react";

export default async function ShopPage() {
    // Fetch data in parallel
    const [items, profile] = await Promise.all([
        getShopItems(),
        getUserProfile(),
    ]);

    const inventory = profile?.gamification.inventory || [];
    const currency = profile?.gamification.currency || 0;



    return (
        <main className="min-h-screen bg-slate-50/70 py-10 px-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-3xl font-bold">
                            <ShoppingBag className="h-8 w-8 text-emerald-500" />
                            Cửa hàng
                        </h1>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                            Mua sắm vật phẩm để trang trí hồ sơ của bạn.
                        </p>
                    </div>


                </div>

                <ShopClient items={items} inventory={inventory} currency={currency} />
            </div>
        </main>
    );
}
