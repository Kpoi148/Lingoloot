import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth-options";
import Category from "../../../../models/Category";
import TopicProgress from "../../../../models/TopicProgress";
import { connectToDatabase } from "../../../../lib/mongodb";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const category_id =
      typeof body?.category_id === "string" ? body.category_id.trim() : "";
    const category_slug =
      typeof body?.category_slug === "string" ? body.category_slug.trim() : "";

    if (!category_id && !category_slug) {
      return NextResponse.json(
        { message: "Category is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let resolvedCategoryId = category_id;
    if (!resolvedCategoryId && category_slug) {
      const category = await Category.findOne({ slug: category_slug })
        .select("_id")
        .lean();
      resolvedCategoryId = category?._id?.toString() ?? "";
    }

    if (!resolvedCategoryId) {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 }
      );
    }

    const progress = await TopicProgress.findOneAndUpdate(
      { user_id: session.user.id, category_id: resolvedCategoryId },
      { $set: { quiz_completed: true, updated_at: new Date() } },
      { new: true, upsert: true }
    ).lean();

    const completed =
      (progress?.vocab_completed ? 50 : 0) +
      (progress?.quiz_completed ? 50 : 0);

    return NextResponse.json({ data: { progress: completed } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update progress.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
