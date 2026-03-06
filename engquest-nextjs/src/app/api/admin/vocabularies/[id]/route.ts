import { NextResponse } from "next/server";
import { createApiErrorResponse } from "@/lib/security/api-error";
import { requireAdminApiSession } from "@/lib/auth/api-auth";
import Vocabulary from "../../../../../models/Vocabulary";
import { connectToDatabase } from "@/lib/db/mongodb";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApiSession();
    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const { id } = await params;
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
      id,
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
    )
      .select("_id")
      .lean();

    if (!updated) {
      return NextResponse.json({ message: "Vocabulary not found." }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        _id: updated._id.toString(),
      },
    });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/admin/vocabularies/[id]:PUT",
      publicMessage: "Unable to update vocabulary.",
    });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApiSession();
    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    await connectToDatabase();
    const { id } = await params;
    const deleted = await Vocabulary.findByIdAndDelete(id)
      .select("_id")
      .lean();

    if (!deleted) {
      return NextResponse.json({ message: "Vocabulary not found." }, { status: 404 });
    }

    return NextResponse.json({ data: { _id: id } });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/admin/vocabularies/[id]:DELETE",
      publicMessage: "Unable to delete vocabulary.",
    });
  }
}
