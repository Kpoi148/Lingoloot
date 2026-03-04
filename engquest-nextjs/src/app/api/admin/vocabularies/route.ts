import { NextResponse } from "next/server";
import { createApiErrorResponse } from "@/lib/api-error";
import { requireAdminApiSession } from "@/lib/api-auth";
import Category from "../../../../models/Category";
import TopicProgress from "../../../../models/TopicProgress";
import Vocabulary from "../../../../models/Vocabulary";
import { connectToDatabase } from "../../../../lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await requireAdminApiSession();
    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() ?? "";
    const filter = query
      ? { word: { $regex: query, $options: "i" } }
      : {};

    await connectToDatabase();

    const vocabularies = await Vocabulary.find(filter)
      .select(
        "word ipa meaning example example_meaning media category_id created_at"
      )
      .sort({ created_at: -1 })
      .lean();

    const categoryIds = Array.from(
      new Set(vocabularies.map((item) => String(item.category_id)))
    );

    const categories = await Category.find({ _id: { $in: categoryIds } })
      .select("name slug")
      .lean();

    const categoryMap = new Map(
      categories.map((category) => [String(category._id), category])
    );

    const data = vocabularies.map((item) => ({
      ...item,
      _id: item._id.toString(),
      category_id: String(item.category_id),
      category: categoryMap.get(String(item.category_id)) ?? null,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/admin/vocabularies:GET",
      publicMessage: "Unable to load vocabularies.",
    });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdminApiSession();
    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

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

    const created = await Vocabulary.create({
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
    });

    await Category.findByIdAndUpdate(category_id, {
      $set: { lastContentUpdatedAt: new Date() },
    });

    await TopicProgress.updateMany(
      { category_id },
      { $set: { vocab_completed: false, updated_at: new Date() } }
    );

    return NextResponse.json({
      data: {
        _id: created._id.toString(),
      },
    });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/admin/vocabularies:POST",
      publicMessage: "Unable to create vocabulary.",
    });
  }
}
