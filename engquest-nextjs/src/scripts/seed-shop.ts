// @ts-nocheck
import mongoose from "mongoose";
import ShopItem from "../models/ShopItem";
import { connectToDatabase } from "../lib/mongodb";
import fs from "fs";
import path from "path";

// Load .env.local manually
try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, "utf8");
        envConfig.split("\n").forEach((line) => {
            const parts = line.split("=");
            if (parts.length >= 2) {
                const key = parts[0].trim();
                let value = parts.slice(1).join("=").trim();
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                if (key && value) {
                    process.env[key] = value;
                }
            }
        });
    }
} catch (e) {
    console.log("Could not load .env.local");
}

const FRAMES = [
    {
        name: "Golden Frame",
        type: "frame",
        imageUrl: "/frames/gold.png",
        price: 500,
        rarity: "rare",
    },
    {
        name: "Neon Pulse",
        type: "frame",
        imageUrl: "/frames/neon.png",
        price: 1000,
        rarity: "legendary",
    },
    {
        name: "Wooden Border",
        type: "frame",
        imageUrl: "/frames/wood.png",
        price: 100,
        rarity: "common",
    },
    {
        name: "Silver Lining",
        type: "frame",
        imageUrl: "/frames/silver.png",
        price: 250,
        rarity: "common",
    },
    {
        name: "Ruby Ring",
        type: "frame",
        imageUrl: "/frames/ruby.png",
        price: 750,
        rarity: "rare",
    },
];

const AVATARS = [
    {
        name: "Cool Cat",
        type: "avatar",
        imageUrl: "/avatars/cat.png",
        price: 200,
        rarity: "common",
    },
    {
        name: "Space Dog",
        type: "avatar",
        imageUrl: "/avatars/dog.png",
        price: 500,
        rarity: "rare",
    },
    {
        name: "Cyber Punk",
        type: "avatar",
        imageUrl: "/avatars/cyber.png",
        price: 1000,
        rarity: "legendary",
    },
    {
        name: "Wizard",
        type: "avatar",
        imageUrl: "/avatars/wizard.png",
        price: 750,
        rarity: "rare",
    },
    {
        name: "Robot",
        type: "avatar",
        imageUrl: "/avatars/robot.png",
        price: 300,
        rarity: "common",
    },
];

const SVG_FRAMES = [
    {
        name: "Tech Loader",
        type: "frame",
        imageUrl: "/frames/tech-placeholder.png", // Fallback
        price: 500,
        rarity: "rare",
        renderKey: "tech-svg",
    },
    {
        name: "Mystic Rune",
        type: "frame",
        imageUrl: "/frames/mystic-placeholder.png",
        price: 1000,
        rarity: "rare",
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

async function seedShop() {
    try {
        console.log("Connecting to database...");
        await connectToDatabase();
        console.log("Connected!");

        console.log("Clearing existing Shop Items...");
        await ShopItem.deleteMany({});
        console.log("Cleared!");

        console.log("Seeding Frames...");
        await ShopItem.insertMany(FRAMES);

        console.log("Seeding Avatars...");
        await ShopItem.insertMany(AVATARS);

        console.log("Seeding SVG Frames...");
        for (const item of SVG_FRAMES) {
            await ShopItem.findOneAndUpdate(
                { name: item.name },
                item,
                { upsert: true, new: true }
            );
        }

        console.log("Shop seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding shop:", error);
        process.exit(1);
    }
}

seedShop();
