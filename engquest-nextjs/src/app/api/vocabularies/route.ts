import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { createApiErrorResponse } from "@/lib/api-error";
import { getCachedCategoryBySlug } from "../../../lib/cached-queries";
import Vocabulary from "../../../models/Vocabulary";
import { connectToDatabase } from "../../../lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug")?.trim();

    if (!slug) {
      return NextResponse.json(
        { message: "Missing category slug." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const category = await getCachedCategoryBySlug(slug);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 }
      );
    }

    const categoryId = String(category._id);
    const objectId = mongoose.Types.ObjectId.isValid(categoryId)
      ? new mongoose.Types.ObjectId(categoryId)
      : null;
    const ids = objectId ? [objectId, categoryId] : [categoryId];

    const vocabularies = await Vocabulary.collection
      .find({
        category_id: { $in: ids },
      })
      .project({
        word: 1,
        ipa: 1,
        meaning: 1,
        example: 1,
        example_meaning: 1,
        media: 1,
        created_at: 1,
        category_id: 1,
      })
      .sort({ created_at: 1 })
      .toArray();

    const data = vocabularies.map((vocab) => ({
      ...vocab,
      _id: vocab._id.toString(),
      category_id: String(vocab.category_id),
    }));

    return NextResponse.json({
      category: {
        _id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description ?? "",
      },
      data,
    });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/vocabularies",
      publicMessage: "Unable to fetch vocabularies.",
    });
  }
}
