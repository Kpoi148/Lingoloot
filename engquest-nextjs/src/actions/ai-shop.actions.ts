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
export async function generateAIFrame(prompt: string, style: string) {
    try {
        console.log(`Generating AI Frame with Prompt: "${prompt}" and Style: "${style}"`);

        // Simulating API delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // SMART GENERATION LOGIC v2: Layered Composition
        const p = prompt.toLowerCase();

        // --- 1. COLOR & PALETTE ---
        let primary = "#F5A623"; // Gold
        let secondary = "#F76B1C";

        if (p.includes("fire") || p.includes("lửa") || p.includes("red") || p.includes("đỏ")) { primary = "#EF4444"; secondary = "#7F1D1D"; }
        else if (p.includes("ice") || p.includes("băng") || p.includes("blue") || p.includes("xanh") || p.includes("nước")) { primary = "#3B82F6"; secondary = "#1E3A8A"; }
        else if (p.includes("nature") || p.includes("cây") || p.includes("green") || p.includes("lá")) { primary = "#10B981"; secondary = "#064E3B"; }
        else if (p.includes("dark") || p.includes("tối") || p.includes("black") || p.includes("đen") || p.includes("shadow")) { primary = "#1F2937"; secondary = "#000000"; }
        else if (p.includes("pink") || p.includes("hồng") || p.includes("love") || p.includes("yêu")) { primary = "#F472B6"; secondary = "#831843"; }
        else if (p.includes("purple") || p.includes("tím") || p.includes("magic") || p.includes("phép")) { primary = "#A855F7"; secondary = "#581C87"; }

        // --- 2. BASE SHAPE (Geometry) ---
        // Defaults to Circle, but can be Square or Hex based on prompt or random chance
        let shape = "circle";
        if (p.includes("vuông") || p.includes("square") || p.includes("tech") || p.includes("pixel")) shape = "rect";
        else if (p.includes("lục giác") || p.includes("hex") || p.includes("ong") || p.includes("mạnh")) shape = "hex";
        else if (!p.includes("tròn") && !p.includes("circle") && Math.random() > 0.7) shape = Math.random() > 0.5 ? "rect" : "hex";

        // --- 3. ANIMATION PARAMS ---
        const id = Math.random().toString(36).substring(7);
        const speed = 3 + Math.random() * 7; // 3s to 10s
        const direction = Math.random() > 0.5 ? "" : "reverse";

        // --- 4. GENERATE LAYERS ---
        let defs = `
            <linearGradient id="g-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${secondary};stop-opacity:1" />
            </linearGradient>
            <filter id="glow-${id}">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
        `;

        let styles = `
            @keyframes spin-${id} { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes pulse-${id} { 0%, 100% { opacity: 0.6; stroke-width: 1; } 50% { opacity: 1; stroke-width: 2.5; } }
            @keyframes float-${id} { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-3px); } }
            .base-${id} { animation: pulse-${id} ${speed / 2}s ease-in-out infinite; }
            .mid-${id} { transform-origin: center; animation: spin-${id} ${speed}s linear infinite ${direction}; }
            .top-${id} { transform-origin: center; animation: spin-${id} ${speed * 1.5}s linear infinite ${direction === "" ? "reverse" : ""}; }
            .part-${id} { animation: float-${id} 3s ease-in-out infinite; }
        `;

        let content = "";

        // Layer 1: Base Border (The foundation)
        if (shape === "rect") {
            content += `<rect x="5" y="5" width="90" height="90" rx="15" stroke="url(#g-${id})" stroke-width="2" fill="none" class="base-${id}" />`;
            // Decoration
            content += `<rect x="12" y="12" width="76" height="76" rx="10" stroke="${secondary}" stroke-width="1" fill="none" stroke-dasharray="10,5" opacity="0.5" class="mid-${id}" />`;
        } else if (shape === "hex") {
            // Approx Hexagon Path
            const hexPath = "M50 5 L93.3 27.5 L93.3 72.5 L50 95 L6.7 72.5 L6.7 27.5 Z";
            content += `<path d="${hexPath}" stroke="url(#g-${id})" stroke-width="2" fill="none" class="base-${id}" stroke-linejoin="round" />`;
            content += `<path d="${hexPath}" stroke="${secondary}" stroke-width="1" fill="none" stroke-dasharray="5,5" transform="scale(0.85)" transform-origin="center" class="mid-${id}" />`;
        } else {
            // Circle (Default)
            content += `<circle cx="50" cy="50" r="45" stroke="url(#g-${id})" stroke-width="2" fill="none" class="base-${id}" />`;
            content += `<circle cx="50" cy="50" r="40" stroke="${secondary}" stroke-width="1" fill="none" stroke-dasharray="${10 + Math.random() * 30}, 10" class="mid-${id}" />`;
        }

        // Layer 2: Dynamic Effects (The "Wow" factor)
        // Add random rotating element on top
        if (Math.random() > 0.3) { // 70% chance to have top rings
            if (shape === "rect") {
                content += `<rect x="2" y="2" width="96" height="96" rx="20" stroke="${primary}" stroke-width="1" fill="none" stroke-dasharray="40, 60" class="top-${id}" opacity="0.8" />`;
            } else {
                content += `<circle cx="50" cy="50" r="${shape === 'hex' ? 48 : 47}" stroke="${primary}" stroke-width="2" fill="none" stroke-dasharray="10, 80" stroke-linecap="round" class="top-${id}" filter="url(#glow-${id})" />`;
            }
        }

        // Layer 3: Particles (Details)
        const pCount = 3 + Math.floor(Math.random() * 4);
        for (let i = 0; i < pCount; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const r = 40 + Math.random() * 10;
            const px = 50 + r * Math.cos(angle);
            const py = 50 + r * Math.sin(angle);
            const size = 1 + Math.random() * 2;
            content += `<circle cx="${px}" cy="${py}" r="${size}" fill="${primary}" opacity="0.7" class="part-${id}" style="animation-delay: -${Math.random() * 2}s" />`;
        }

        const svg = `
        <svg w="300" h="300" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>${defs}</defs>
            <style>${styles}</style>
            ${content}
        </svg>
        `.trim();

        const base64Svg = Buffer.from(svg).toString("base64");
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
            msg: "Failed to generate frame. Please try again.",
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
