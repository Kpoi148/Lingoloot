"use server";

import { ensureAdminSession } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import ShopItem from "@/models/ShopItem";
import { revalidatePath } from "next/cache";
import type { AdminShopItem, ShopItemRarity, ShopItemType } from "@/types/shop-item";

// Type definition for form data handling
export type ShopItemFormData = {
    name: string;
    type: "frame" | "avatar";
    imageUrl: string;
    price: number;
    rarity: "common" | "rare" | "legendary";
    renderKey?: string;
    isActive: boolean;
};

async function ensureAdminAndConnect() {
    await ensureAdminSession();
    await connectToDatabase();
}

export async function getAdminShopItems(): Promise<AdminShopItem[]> {
    await ensureAdminAndConnect();
    try {
        const items = await ShopItem.find({}).sort({ createdAt: -1 }).lean();
        return items.map((item) => ({
            _id: String(item._id),
            name: item.name,
            type: item.type as ShopItemType,
            imageUrl: item.imageUrl,
            price: item.price,
            rarity: item.rarity as ShopItemRarity,
            renderKey: item.renderKey,
            isActive: Boolean(item.isActive),
        }));
    } catch (error) {
        console.error("Failed to fetch admin shop items:", error);
        return [];
    }
}

export async function getShopItemById(id: string): Promise<AdminShopItem | null> {
    await ensureAdminAndConnect();
    try {
        const item = await ShopItem.findById(id).lean();
        if (!item) return null;
        return {
            _id: String(item._id),
            name: item.name,
            type: item.type as ShopItemType,
            imageUrl: item.imageUrl,
            price: item.price,
            rarity: item.rarity as ShopItemRarity,
            renderKey: item.renderKey,
            isActive: Boolean(item.isActive),
        };
    } catch (error) {
        console.error("Failed to fetch shop item:", error);
        return null;
    }
}

export async function createShopItem(data: ShopItemFormData) {
    await ensureAdminAndConnect();
    try {
        const newItem = await ShopItem.create(data);
        revalidatePath("/admin/shop-management");
        revalidatePath("/shop");
        return { success: true, message: "Đã tạo vật phẩm mới.", id: newItem._id.toString() };
    } catch (error) {
        console.error("Failed to create shop item:", error);
        return { success: false, message: "Lỗi khi tạo vật phẩm." };
    }
}

export async function updateShopItem(id: string, data: Partial<ShopItemFormData>) {
    await ensureAdminAndConnect();
    try {
        await ShopItem.findByIdAndUpdate(id, { $set: data });
        revalidatePath("/admin/shop-management");
        revalidatePath("/shop");
        return { success: true, message: "Đã cập nhật vật phẩm." };
    } catch (error) {
        console.error("Failed to update shop item:", error);
        return { success: false, message: "Lỗi khi cập nhật vật phẩm." };
    }
}

export async function deleteShopItem(id: string) {
    await ensureAdminAndConnect();
    try {
        // Ideally we might want 'soft delete' logic, but for now strict delete is requested in plan implies management choice.
        // Or we can just set isActive: false if preferred, but let's support delete.
        await ShopItem.findByIdAndDelete(id);
        revalidatePath("/admin/shop-management");
        revalidatePath("/shop");
        return { success: true, message: "Đã xóa vật phẩm." };
    } catch (error) {
        console.error("Failed to delete shop item:", error);
        return { success: false, message: "Lỗi khi xóa vật phẩm." };
    }
}

export async function toggleShopItemStatus(id: string, isActive: boolean) {
    await ensureAdminAndConnect();
    try {
        await ShopItem.findByIdAndUpdate(id, { $set: { isActive } });
        revalidatePath("/admin/shop-management");
        revalidatePath("/shop");
        return { success: true, message: isActive ? "Đã kích hoạt vật phẩm." : "Đã ẩn vật phẩm." };
    } catch (error) {
        console.error("Failed to toggle item status:", error);
        return { success: false, message: "Lỗi khi thay đổi trạng thái." };
    }
}

export async function restoreDefaultFrames() {
    await ensureAdminAndConnect();
    try {
        const defaults = [
            {
                name: "Golden Hex",
                type: "frame",
                price: 1500,
                rarity: "legendary",
                renderKey: "hex-svg",
                imageUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=Hex&backgroundColor=F5A623",
                isActive: true
            },
            {
                name: "Tech Hud",
                type: "frame",
                price: 800,
                rarity: "rare",
                renderKey: "tech-svg",
                imageUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=Tech&backgroundColor=007CF0",
                isActive: true
            },
            {
                name: "Mystic Runes",
                type: "frame",
                price: 1200,
                rarity: "rare",
                renderKey: "mystic-svg",
                imageUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=Mystic&backgroundColor=7928CA",
                isActive: true
            }
        ];

        let restoredCount = 0;

        for (const item of defaults) {
            // Check existing defaults by renderKey before creating new records.
            const exists = await ShopItem.findOne({ renderKey: item.renderKey });
            if (!exists) {
                await ShopItem.create(item);
                restoredCount++;
            }
        }

        revalidatePath("/admin/shop-management");
        revalidatePath("/shop");
        return { success: true, message: `Đã khôi phục ${restoredCount} khung mặc định.` };

    } catch (error) {
        console.error("Failed to restore default frames:", error);
        return { success: false, message: "Lỗi khi khôi phục khung." };
    }
}
