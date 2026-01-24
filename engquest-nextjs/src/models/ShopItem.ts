import mongoose from "mongoose";

export type ShopItemType = "frame" | "avatar";
export type ShopItemRarity = "common" | "rare" | "legendary";

export interface ShopItemDocument extends mongoose.Document {
    name: string;
    type: ShopItemType;
    imageUrl: string;
    price: number;
    rarity: ShopItemRarity;
    isActive: boolean;
    renderKey?: string;
}

const ShopItemSchema = new mongoose.Schema<ShopItemDocument>(
    {
        name: { type: String, required: true, trim: true },
        type: { type: String, enum: ["frame", "avatar"], required: true },
        imageUrl: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        rarity: {
            type: String,
            enum: ["common", "rare", "legendary"],
            default: "common",
        },
        isActive: { type: Boolean, default: true },
        renderKey: { type: String },
    },
    { timestamps: true }
);

const ShopItem =
    (mongoose.models.ShopItem as mongoose.Model<ShopItemDocument>) ||
    mongoose.model<ShopItemDocument>("ShopItem", ShopItemSchema);

export default ShopItem;
