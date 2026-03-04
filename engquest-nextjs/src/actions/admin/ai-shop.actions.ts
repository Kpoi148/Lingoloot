"use server";

import { ensureAdminSession } from "@/lib/auth-utils";
import { AI_FRAME_SYSTEM_PROMPT } from "@/lib/ai-prompts";
import ShopItem from "@/models/ShopItem";
import { connectToDatabase } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

/* 
  Mock AI Generation Function
  In a real app, this would call OpenAI DALL-E 3 or Stability AI API.
  For now, it returns a placeholder image based on the style.
*/
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateAIFrame(prompt: string, style: string) {
    try {
        await ensureAdminSession();
        console.log(`Generating AI Frame with Prompt: "${prompt}" and style: "${style}"`);

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Missing GEMINI_API_KEY environment variable.");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `${AI_FRAME_SYSTEM_PROMPT.replace("{prompt}", prompt)}\nPreferred style: ${style}`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        let svgText = response.text();

        // Cleanup markdown code blocks if present
        svgText = svgText.replace(/```xml/g, "").replace(/```svg/g, "").replace(/```/g, "").trim();

        // Basic validation to ensure it looks like SVG
        if (!svgText.includes("<svg") || !svgText.includes("</svg>")) {
            throw new Error("AI response was not a valid SVG.");
        }

        const base64Svg = Buffer.from(svgText).toString("base64");
        const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;

        return {
            success: true,
            imageUrl: dataUrl,
            message: "Frame generated successfully!",
        };
    } catch (error) {
        console.error("Error generating AI frame:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to generate frame. Please try again.",
        };
    }
}

/*
    Save the Generated Frame to the Shop
*/
export async function saveAIFrameToShop(data: {
    name: string;
    imageUrl: string;
    price: number;
    rarity: "common" | "rare" | "legendary";
}) {
    try {
        await ensureAdminSession();

        await connectToDatabase();

        const newItem = await ShopItem.create({
            name: data.name,
            type: "frame",
            imageUrl: data.imageUrl,
            price: data.price,
            rarity: data.rarity,
            isActive: true,
            renderKey: "universal-frame", // Use a generic key that uses the ImageUrl
        });

        revalidatePath("/shop");
        revalidatePath("/admin/shop");

        return {
            success: true,
            item: JSON.parse(JSON.stringify(newItem)),
            message: "Frame saved to Shop successfully!",
        };
    } catch (error) {
        console.error("Error saving AI frame to shop:", error);
        return {
            success: false,
            message: "Failed to save frame to shop.",
        };
    }
}
