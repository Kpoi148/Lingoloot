"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
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
        console.log(`Generating AI Frame with Prompt: "${prompt}"`);

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Missing GEMINI_API_KEY environment variable.");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const systemPrompt = `
You are an expert SVG Generative Artist & Animator.
Your task is to generate a HIGH-END, ANIMATED avatar frame based on the user's description.

CONTAINER & CONSTRAINTS:
- Output: Return ONLY the raw <svg> string. NO markdown, NO \`\`\`, NO explanation.
- ViewBox: "0 0 100 100".
- Safe Zone: The user's avatar is a circle at (cx=50, cy=50, r=42).
- CRITICAL: The area inside the Safe Zone (r=42) must be FULLY TRANSPARENT. Do not place opaque background shapes there. However, small particles, glows, or aura effects CAN slightly overlap the edges for depth.

ARTISTIC REQUIREMENTS:
1. **Composition:** Do NOT just draw a simple donut. Use complex paths, floating elements, and layered structures (Background Ring + Foreground Details + Particles).
2. **Animation (Mandatory):**
   - Use <style> with CSS @keyframes.
   - Animations MUST be 'infinite'.
   - Include diverse movements: spin (rotate), pulse (scale), float (translate), or dash-offset (marching ants).
3. **Visuals:** Use <defs> for Linear/Radial Gradients and <filter> for Glow/Blur/Shadow effects.
4. **Uniqueness:** Make it look like a premium video game item (Rare/Legendary tier).

USER PROMPT: "${prompt}"
`;

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
            msg: "Frame generated successfully!",
        };
    } catch (error) {
        console.error("Error generating AI frame:", error);
        return {
            success: false,
            msg: error instanceof Error ? error.message : "Failed to generate frame. Please try again.",
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
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            throw new Error("Unauthorized");
        }

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
            msg: "Frame saved to Shop successfully!",
        };
    } catch (error) {
        console.error("Error saving AI frame to shop:", error);
        return {
            success: false,
            msg: "Failed to save frame to shop.",
        };
    }
}
