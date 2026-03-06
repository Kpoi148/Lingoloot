import { NextResponse } from "next/server";
import { z } from "zod";
import { createApiErrorResponse } from "@/lib/security/api-error";
import { requireAdminApiSession } from "@/lib/auth/api-auth";
import Game from "@/models/Game";
import { connectToDatabase } from "@/lib/db/mongodb";

const ContentItemSchema = z
  .object({
    text: z.string().min(1),
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

const CreateGameSchema = z.object({
  title: z.string().min(1),
  topicName: z.string().min(1),
  status: z.enum(["draft", "active"]).optional(),
  content: z.array(ContentItemSchema).min(1),
  distractors: z.array(z.string()).default([]),
});

export async function POST(req: Request) {
  try {
    const auth = await requireAdminApiSession();
    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const body = await req.json();
    const parsed = CreateGameSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Game payload is invalid." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const created = await Game.create({
      title: parsed.data.title.trim(),
      topicName: parsed.data.topicName.trim(),
      status: parsed.data.status ?? "draft",
      content: parsed.data.content.map((item) => ({
        text: item.text.trim(),
        type: item.type,
        answer: item.answer?.trim(),
      })),
      distractors: parsed.data.distractors.map((item) => item.trim()),
    });

    return NextResponse.json({ data: { _id: created._id.toString() } });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/admin/games",
      publicMessage: "Unable to save game.",
    });
  }
}
