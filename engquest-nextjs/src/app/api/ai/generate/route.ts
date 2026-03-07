// Shared admin AI generation API for vocabulary, quizzes, and structured JSON content.
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createApiErrorResponse } from "@/lib/security/api-error";
import { requireAdminApiSession } from "@/lib/auth/api-auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/request-ip";

export const dynamic = "force-dynamic";

const SYSTEM_INSTRUCTION = `
ROLE: You are a strict Data Generation API. Output ONLY valid JSON.
MODE A (Word): IF user sends a word -> Return JSON: { 
  "word": "String", 
  "ipa": "String", 
  "meaning": "Vietnamese String", 
  "example": "English String",
  "example_meaning": "Vietnamese String"
}
MODE B (Category): IF user sends "Category: [Topic]" -> Return Array of 10 word objects (Mode A schema), or exactly the requested count if specified.
MODE C (Quiz): IF user sends "Quiz: [Topic]" -> Return JSON: {
  "questions": [
    {
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "String matching one option",
      "explanation": "Vietnamese explanation"
    }
  ]
}`;
const stripMarkdownCodeFence = (text: string) => {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  return trimmed.replace(/```/g, "").trim();
};

export async function POST(req: Request) {
  try {
    const auth = await requireAdminApiSession();
    if (!auth.ok) {
      return NextResponse.json(
        { success: false, error: auth.message },
        { status: auth.status }
      );
    }

    const clientIp = getClientIp(req);
    const rateLimit = await checkRateLimit(
      `ai-generate:user:${auth.session.user.id}:ip:${clientIp}`,
      { max: 20, windowMs: 15 * 60 * 1000 }
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const body = await req.json();
    const prompt =
      typeof body?.prompt === "string" ? body.prompt.trim() : "";
    const type = typeof body?.type === "string" ? body.type.trim() : "";
    const userInstruction =
      typeof body?.userInstruction === "string"
        ? body.userInstruction.trim()
        : "";
    const dataContext =
      typeof body?.dataContext === "string" ? body.dataContext.trim() : "";
    const listContext = Array.isArray(body?.dataContext)
      ? JSON.stringify(body.dataContext)
      : "";
    const fallbackPrompt = [userInstruction, dataContext, listContext]
      .filter(Boolean)
      .join("\n");
    const finalPrompt = prompt || fallbackPrompt;

    if (!finalPrompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const quizContext = dataContext || listContext;
    const composedPrompt =
      type === "quiz_custom"
        ? `CONTEXT: Generate a quiz based on topic '${quizContext}'. USER INSTRUCTION: ${userInstruction} CRITICAL OUTPUT RULE: You MUST return ONLY valid JSON with this schema: { title, questions: [{ question, options: [], correctAnswer, explanation }] }. Do NOT ignore the JSON requirement.`
        : type
        ? `Type: ${type}\nPrompt: ${finalPrompt}`
        : finalPrompt;

    const result = await model.generateContent(composedPrompt);
    const rawText = result.response.text();
    const cleanedText = stripMarkdownCodeFence(rawText);

    let data: unknown;
    try {
      data = JSON.parse(cleanedText);
    } catch {
      throw new Error("Invalid JSON returned from model.");
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/ai/generate",
      publicMessage: "Failed to generate content.",
      field: "error",
    });
  }
}
