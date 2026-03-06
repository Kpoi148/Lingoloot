"use server";

import mongoose from "mongoose";
import { getSession } from "@/lib/auth/auth-utils";
import { connectToDatabase } from "@/lib/db/mongodb";
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

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return { success: false, message: "Vật phẩm không tồn tại hoặc đã ngừng bán." };
    }

    await connectToDatabase();

    const item = await ShopItem.findOne({ _id: itemId, isActive: true })
        .select("name price")
        .lean();
    if (!item) {
        return { success: false, message: "Vật phẩm không tồn tại hoặc đã ngừng bán." };
    }

    const updatedUser = await User.findOneAndUpdate(
        {
            _id: session.user.id,
            "gamification.currency": { $gte: item.price },
            "gamification.inventory": { $ne: itemId },
        },
        {
            $inc: { "gamification.currency": -item.price },
            $addToSet: { "gamification.inventory": itemId },
        },
        {
            new: true,
            projection: { "gamification.currency": 1 },
        }
    ).lean();

    if (!updatedUser) {
        const user = await User.findById(session.user.id).select("gamification").lean();
        if (!user) {
            return { success: false, message: "Không tìm thấy người dùng." };
        }

        const inventory = user.gamification?.inventory ?? [];
        if (inventory.includes(itemId)) {
            return { success: false, message: "Bạn đã sở hữu vật phẩm này." };
        }

        const currentCurrency = user.gamification?.currency ?? 0;
        if (currentCurrency < item.price) {
            return { success: false, message: "Bạn không đủ LingoGems." };
        }

        return { success: false, message: "Không thể hoàn tất giao dịch. Vui lòng thử lại." };
    }

    const newBalance = updatedUser.gamification?.currency ?? 0;

    revalidatePath("/shop");
    revalidatePath("/profile");

    return {
        success: true,
        newBalance,
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
