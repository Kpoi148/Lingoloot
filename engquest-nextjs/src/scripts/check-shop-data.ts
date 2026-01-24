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
                const value = parts.slice(1).join("=").trim();
                if (key && value) {
                    process.env[key] = value;
                }
            }
        });
    }
} catch (e) {
    console.log("Could not load .env.local");
}

async function checkShopData() {
    try {
        console.log("Connecting to database...");
        await connectToDatabase();
        console.log("Connected!");

        const items = await ShopItem.find({});
        console.log(`Found ${items.length} items in database:`);
        items.forEach(item => {
            console.log(`- ${item.name} (${item.type}) | Price: ${item.price} | isActive: ${item.isActive}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error checking checkShopData:", error);
        process.exit(1);
    }
}

checkShopData();
