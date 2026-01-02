import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

export const dynamic = "force-dynamic";

const SYSTEM_INSTRUCTION =
  "You are an Education Game Engine. Convert the input vocabulary into a 'Story Cloze' game.";

const EXAMPLE_INPUT = ["Cat", "Dog"];
const EXAMPLE_OUTPUT = `{
  "title": "My Pet Story",
  "content": [
     {"text": "I have a ", "type": "text"},
     {"text": "Cat", "type": "gap", "answer": "Cat"},
     {"text": " named Tom.", "type": "text"}
  ],
  "distractors": ["Car", "Bird"]
}`;

const DifficultySchema = z.enum(["easy", "medium", "hard"]);

const InputSchema = z.object({
  topicName: z.string().min(1),
  difficulty: DifficultySchema.optional(),
  vocabularyList: z
    .array(
      z.object({
        word: z.string().min(1),
        meaning: z.string().min(1),
      })
    )
    .min(1),
});

const ContentItemSchema = z
  .object({
    text: z.string(),
    type: z.enum(["text", "gap"]),
    answer: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.type === "gap" && !value.answer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "answer is required when type is 'gap'",
      });
    }
  });

const GameSchema = z.object({
  title: z.string(),
  content: z.array(ContentItemSchema),
  distractors: z.array(z.string()),
});

type Game = z.infer<typeof GameSchema>;
type VocabularyItem = z.infer<typeof InputSchema>["vocabularyList"][number];

const stripMarkdownCodeFence = (text: string) => {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  return trimmed.replace(/```/g, "").trim();
};

const buildPrompt = (
  topicName: string,
  vocabularyList: VocabularyItem[],
  difficulty: z.infer<typeof DifficultySchema> = "medium"
) => {
  const schemaHint = `{
  "title": "string",
  "content": [
    {"text": "string", "type": "text"},
    {"text": "string", "type": "gap", "answer": "string"}
  ],
  "distractors": ["string"]
}`;

  const difficultyGuide =
    difficulty === "easy"
      ? "Use very simple sentences and basic words. Make gaps obvious."
      : difficulty === "hard"
      ? "Use longer sentences and more advanced word usage. Make distractors close to answers."
      : "Use moderately simple sentences and a mix of basic and intermediate words.";

  return [
    `SYSTEM INSTRUCTION: ${SYSTEM_INSTRUCTION}`,
    "",
    "EXAMPLE INPUT:",
    JSON.stringify(EXAMPLE_INPUT),
    "",
    "EXAMPLE OUTPUT (JSON):",
    EXAMPLE_OUTPUT,
    "",
    "INPUT:",
    `Topic: ${topicName}`,
    `Difficulty: ${difficulty}`,
    `Vocabulary: ${JSON.stringify(vocabularyList, null, 2)}`,
    "",
    "DIFFICULTY RULES:",
    difficultyGuide,
    "",
    "OUTPUT RULES:",
    "- Output ONLY valid JSON.",
    `- Match this schema exactly: ${schemaHint}`,
    "- Include an answer only when type is 'gap'.",
    "- Use vocabulary words as gap answers.",
  ].join("\n");
};

const formatZodIssues = (issues: z.ZodIssue[]) =>
  issues.map((issue) => issue.message).join(" | ");

const parseGameResponse = (rawText: string) => {
  const cleanedText = stripMarkdownCodeFence(rawText);
  let data: unknown;

  try {
    data = JSON.parse(cleanedText);
  } catch (error) {
    throw new Error("Invalid JSON returned from model.");
  }

  const parsed = GameSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `AI response failed validation: ${formatZodIssues(parsed.error.issues)}`
    );
  }

  return parsed.data;
};

const generateGame = async (
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  prompt: string
) => {
  let lastError: Error | null = null;
  const attempts = 2;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const attemptPrompt =
      attempt === 1
        ? prompt
        : [
            prompt,
            "",
            "The previous output failed validation.",
            lastError?.message ?? "",
            "Return corrected JSON only.",
          ].join("\n");

    const result = await model.generateContent(attemptPrompt);
    const rawText = result.response.text();

    try {
      return parseGameResponse(rawText);
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("AI response failed validation.");
    }
  }

  throw (
    lastError ?? new Error("AI response failed validation after retries.")
  );
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedInput = InputSchema.safeParse(body);

    if (!parsedInput.success) {
      return NextResponse.json(
        { message: "topicName and vocabularyList are required." },
        { status: 400 }
      );
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

    const prompt = buildPrompt(
      parsedInput.data.topicName,
      parsedInput.data.vocabularyList,
      parsedInput.data.difficulty ?? "medium"
    );

    const game = await generateGame(model, prompt);

    return NextResponse.json(game);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate game content.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
