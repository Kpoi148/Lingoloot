// Source module for the scripts feature.
import ShopItem from "../models/ShopItem";
import { connectToDatabase } from "../lib/db/mongodb";

const SVG_FRAMES = [
    {
        name: "Tech Loader",
        type: "frame",
        imageUrl: "/frames/tech-placeholder.png", // Fallback/Placeholder
        price: 500,
        rarity: "rare",
        renderKey: "tech-svg",
    },
    {
        name: "Mystic Rune",
        type: "frame",
        imageUrl: "/frames/mystic-placeholder.png",
        price: 1000,
        rarity: "rare", // Or legendary per user request? Request said Epic (not in enum), mapped to Rare or Legendary
        renderKey: "mystic-svg",
    },
    {
        name: "Golden Hex",
        type: "frame",
        imageUrl: "/frames/hex-placeholder.png",
        price: 2000,
        rarity: "legendary",
        renderKey: "hex-svg",
    },
];

async function seedSvgFrames() {
    try {
        console.log("Connecting to database...");
        await connectToDatabase();
        console.log("Connected!");

        console.log("Seeding SVG Frames...");
        // Update existing if name is same, or insert new
        for (const item of SVG_FRAMES) {
            await ShopItem.findOneAndUpdate(
                { name: item.name },
                item,
                { upsert: true, new: true }
            );
            console.log(`Upserted: ${item.name}`);
        }

        console.log("SVG Frames seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding SVG frames:", error);
        process.exit(1);
    }
}

seedSvgFrames();
