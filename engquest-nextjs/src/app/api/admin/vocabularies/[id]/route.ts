import { NextResponse } from "next/server";
import Vocabulary from "../../../../../models/Vocabulary";
import { connectToDatabase } from "../../../../../lib/mongodb";

export const dynamic = "force-dynamic";

type RouteParams = {
  params: { id: string };
};

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const body = await req.json();
    const word = typeof body?.word === "string" ? body.word.trim() : "";
    const ipa = typeof body?.ipa === "string" ? body.ipa.trim() : "";
    const meaning =
      typeof body?.meaning === "string" ? body.meaning.trim() : "";
    const example =
      typeof body?.example === "string" ? body.example.trim() : "";
    const example_meaning =
      typeof body?.example_meaning === "string"
        ? body.example_meaning.trim()
        : "";
    const category_id =
      typeof body?.category_id === "string" ? body.category_id.trim() : "";
    const media = body?.media ?? {};

    if (!word || !meaning || !category_id) {
      return NextResponse.json(
        { message: "Word, meaning, and category are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updated = await Vocabulary.findByIdAndUpdate(
      params.id,
      {
        word,
        ipa: ipa || undefined,
        meaning,
        example: example || undefined,
        example_meaning: example_meaning || undefined,
        category_id,
        media: {
          image: typeof media.image === "string" ? media.image.trim() : undefined,
          audio: typeof media.audio === "string" ? media.audio.trim() : undefined,
          video: typeof media.video === "string" ? media.video.trim() : undefined,
        },
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ message: "Vocabulary not found." }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        _id: updated._id.toString(),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update vocabulary.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const deleted = await Vocabulary.findByIdAndDelete(params.id).lean();

    if (!deleted) {
      return NextResponse.json({ message: "Vocabulary not found." }, { status: 404 });
    }

    return NextResponse.json({ data: { _id: params.id } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete vocabulary.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
