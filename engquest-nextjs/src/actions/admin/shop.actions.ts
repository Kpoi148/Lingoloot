"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongodb";
import ShopItem, { ShopItemDocument } from "@/models/ShopItem"; // Keeping ShopItemDocument import for potential typing
import User from "@/models/User"; // We might need this to check admin role
import { revalidatePath } from "next/cache";

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

// Ensure user is admin
async function ensureAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await connectToDatabase();
    const user = await User.findById(session.user.id).select("role").lean();

    if (!user || user.role !== "admin") {
        throw new Error("Forbidden: Admin access required");
    }
}

export async function getAdminShopItems() {
    await ensureAdmin();
    try {
        const items = await ShopItem.find({}).sort({ createdAt: -1 }).lean();
        return items.map((item) => ({
            ...item,
            _id: item._id.toString(),
        }));
    } catch (error) {
        console.error("Failed to fetch admin shop items:", error);
        return [];
    }
}

export async function getShopItemById(id: string) {
    await ensureAdmin();
    try {
        const item = await ShopItem.findById(id).lean();
        if (!item) return null;
        return {
            ...item,
            _id: item._id.toString(),
        };
    } catch (error) {
        console.error("Failed to fetch shop item:", error);
        return null;
    }
}

export async function createShopItem(data: ShopItemFormData) {
    await ensureAdmin();
    try {
        const newItem = await ShopItem.create(data);
        revalidatePath("/admin/shop");
        revalidatePath("/shop");
        return { success: true, message: "Đã tạo vật phẩm mới.", id: newItem._id.toString() };
    } catch (error) {
        console.error("Failed to create shop item:", error);
        return { success: false, message: "Lỗi khi tạo vật phẩm." };
    }
}

export async function updateShopItem(id: string, data: Partial<ShopItemFormData>) {
    await ensureAdmin();
    try {
        await ShopItem.findByIdAndUpdate(id, { $set: data });
        revalidatePath("/admin/shop");
        revalidatePath("/shop");
        return { success: true, message: "Đã cập nhật vật phẩm." };
    } catch (error) {
        console.error("Failed to update shop item:", error);
        return { success: false, message: "Lỗi khi cập nhật vật phẩm." };
    }
}

export async function deleteShopItem(id: string) {
    await ensureAdmin();
    try {
        // Ideally we might want 'soft delete' logic, but for now strict delete is requested in plan implies management choice.
        // Or we can just set isActive: false if preferred, but let's support delete.
        await ShopItem.findByIdAndDelete(id);
        revalidatePath("/admin/shop");
        revalidatePath("/shop");
        return { success: true, message: "Đã xóa vật phẩm." };
    } catch (error) {
        console.error("Failed to delete shop item:", error);
        return { success: false, message: "Lỗi khi xóa vật phẩm." };
    }
}

export async function toggleShopItemStatus(id: string, isActive: boolean) {
    await ensureAdmin();
    try {
        await ShopItem.findByIdAndUpdate(id, { $set: { isActive } });
        revalidatePath("/admin/shop");
        revalidatePath("/shop");
        return { success: true, message: isActive ? "Đã kích hoạt vật phẩm." : "Đã ẩn vật phẩm." };
    } catch (error) {
        console.error("Failed to toggle item status:", error);
        return { success: false, message: "Lỗi khi thay đổi trạng thái." };
    }
}

export async function restoreDefaultFrames() {
    await ensureAdmin();
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
            // Check if exists by renderKey (Cast item as any or partial matching shop item creation)
            const exists = await ShopItem.findOne({ renderKey: item.renderKey });
            if (!exists) {
                await ShopItem.create(item);
                restoredCount++;
            }
        }

        revalidatePath("/admin/shop");
        revalidatePath("/shop");
        return { success: true, message: `Đã khôi phục ${restoredCount} khung mặc định.` };

    } catch (error) {
        console.error("Failed to restore default frames:", error);
        return { success: false, message: "Lỗi khi khôi phục khung." };
    }
}
