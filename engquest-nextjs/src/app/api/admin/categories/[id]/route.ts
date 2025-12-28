import { NextResponse } from "next/server";
import Category from "../../../../../models/Category";
import Vocabulary from "../../../../../models/Vocabulary";
import { connectToDatabase } from "../../../../../lib/mongodb";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
    const description =
      typeof body?.description === "string" ? body.description.trim() : "";
    const image_url =
      typeof body?.image_url === "string" ? body.image_url.trim() : "";
    const order = Number.isFinite(body?.order) ? body.order : Number(body?.order);
    const count = Number.isFinite(body?.count) ? body.count : Number(body?.count);

    if (!name || !slug) {
      return NextResponse.json(
        { message: "Name and slug are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updated = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug: slug.toLowerCase(),
        description: description || undefined,
        image_url: image_url || undefined,
        order: Number.isFinite(order) ? order : 0,
        count: Number.isFinite(count) ? count : undefined,
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ message: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({ data: { _id: updated._id.toString() } });
  } catch (error) {
    const mongoError = error as { code?: number };
    if (mongoError?.code === 11000) {
      return NextResponse.json({ message: "Slug already exists." }, { status: 400 });
    }
    const message =
      error instanceof Error ? error.message : "Unable to update category.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const category = await Category.findById(id).lean();

    if (!category) {
      return NextResponse.json({ message: "Category not found." }, { status: 404 });
    }

    const vocabDeleteResult = await Vocabulary.collection.deleteMany({
      category_id: { $in: [category._id, category._id.toString()] },
    });

    const deleted = await Category.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ message: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({
      data: { _id: id, removedVocabularies: vocabDeleteResult.deletedCount },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete category.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
