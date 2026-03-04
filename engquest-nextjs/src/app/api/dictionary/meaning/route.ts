import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import DictionaryCache from "@/models/DictionaryCache";
import { connectToDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const SYSTEM_INSTRUCTION =
  "You are a bilingual dictionary. Return concise Vietnamese meanings.";

const stripMarkdownCodeFence = (text: string) => {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  return trimmed.replace(/```/g, "").trim();
};

const normalizeWord = (input: string) =>
  input.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "");

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawWord = searchParams.get("word")?.trim() ?? "";
    const cleanedWord = normalizeWord(rawWord);

    if (!cleanedWord) {
      return NextResponse.json(
        { message: "Word is required." },
        { status: 400 }
      );
    }

    if (cleanedWord.length > 64) {
      return NextResponse.json(
        { message: "Word is too long." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalized = cleanedWord.toLowerCase();
    const cached = await DictionaryCache.findOne({ word: normalized })
      .select("word meaning")
      .lean();

    if (cached?.meaning) {
      return NextResponse.json({
        data: { word: cleanedWord, meaning: cached.meaning },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const prompt = [
      "Translate the English word into Vietnamese.",
      "Output ONLY valid JSON with this schema: { \"word\": \"string\", \"meaning\": \"string\" }.",
      `Word: "${cleanedWord}"`,
    ].join("\n");

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanedText = stripMarkdownCodeFence(rawText);

    let data: { word?: string; meaning?: string };
    try {
      data = JSON.parse(cleanedText) as { word?: string; meaning?: string };
    } catch {
      throw new Error("Invalid JSON returned from model.");
    }

    const meaning = typeof data.meaning === "string" ? data.meaning.trim() : "";
    if (!meaning) {
      throw new Error("Model did not return a meaning.");
    }

    await DictionaryCache.findOneAndUpdate(
      { word: normalized },
      { $set: { word: normalized, meaning, createdAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ data: { word: cleanedWord, meaning } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch meaning.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
