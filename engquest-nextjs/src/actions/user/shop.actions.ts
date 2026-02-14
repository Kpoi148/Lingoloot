"use server";

import { getSession } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import ShopItem from "@/models/ShopItem";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import type { ShopCatalogItem, ShopItemRarity, ShopItemType } from "@/types/shop-item";

export async function getShopItems(): Promise<ShopCatalogItem[]> {
    await connectToDatabase();
    try {
        const items = await ShopItem.find({ isActive: true }).lean();
        return items.map((item) => ({
            _id: String(item._id),
            name: item.name,
            type: item.type as ShopItemType,
            imageUrl: item.imageUrl,
            price: item.price,
            rarity: item.rarity as ShopItemRarity,
            renderKey: item.renderKey,
        }));
    } catch (error) {
        console.error("Failed to fetch shop items:", error);
        return [];
    }
}

export type BuyItemResult =
    | { success: true; newBalance: number; message: string }
    | { success: false; message: string };

export async function buyItem(itemId: string): Promise<BuyItemResult> {
    const session = await getSession();
    if (!session?.user?.id) {
        return { success: false, message: "Bạn cần đăng nhập để mua hàng." };
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id).select("gamification").lean();
    if (!user) {
        return { success: false, message: "Không tìm thấy người dùng." };
    }

    const item = await ShopItem.findById(itemId).lean();
    if (!item) {
        return { success: false, message: "Vật phẩm không tồn tại." };
    }

    const currentCurrency = user.gamification?.currency ?? 0;
    const price = item.price;

    if (currentCurrency < price) {
        return { success: false, message: "Bạn không đủ LingoGems." };
    }

    // Check ownership
    const inventory = user.gamification?.inventory ?? [];
    if (inventory.includes(itemId)) {
        return { success: false, message: "Bạn đã sở hữu vật phẩm này." };
    }

    // Deduct currency and add to inventory
    const newCurrency = currentCurrency - price;

    await User.findByIdAndUpdate(
        session.user.id,
        {
            $set: { "gamification.currency": newCurrency },
            $push: { "gamification.inventory": itemId },
        },
        { new: true }
    );

    revalidatePath("/shop");
    revalidatePath("/profile");

    return {
        success: true,
        newBalance: newCurrency,
        message: `Đã mua ${item.name} thành công!`
    };
}

export async function equipItem(type: "frame" | "avatar", itemId: string) {
    const session = await getSession();
    if (!session?.user?.id) {
        return { success: false, message: "Unauthorized." };
    }

    await connectToDatabase();

    const updateField = type === "frame" ? "gamification.equippedFrame" : "gamification.equippedAvatar";

    // Validate ownership
    const user = await User.findById(session.user.id).select("gamification.inventory role").lean();

    // Allow admins to equip any item regardless of inventory
    const isAdmin = user?.role === "admin";

    if (!user || (!isAdmin && !user.gamification?.inventory.includes(itemId))) {
        return { success: false, message: "Bạn không sở hữu vật phẩm này." };
    }

    await User.findByIdAndUpdate(session.user.id, {
        $set: { [updateField]: itemId },
    });

    revalidatePath("/profile");
    return { success: true, message: "Đã trang bị vật phẩm." };
}
