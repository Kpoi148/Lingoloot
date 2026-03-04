import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { createApiErrorResponse } from "@/lib/api-error";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth-options";
import Category from "../../../../models/Category";
import TopicProgress from "../../../../models/TopicProgress";
import { connectToDatabase } from "../../../../lib/mongodb";
import { verifyProgressProof } from "../../../../lib/progress-proof";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const category_id =
      typeof body?.category_id === "string" ? body.category_id.trim() : "";
    const category_slug =
      typeof body?.category_slug === "string" ? body.category_slug.trim() : "";
    const proof = typeof body?.proof === "string" ? body.proof.trim() : "";

    if (!category_id && !category_slug) {
      return NextResponse.json(
        { message: "Category is required." },
        { status: 400 }
      );
    }

    if (!proof) {
      return NextResponse.json(
        { message: "Progress proof is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let resolvedCategoryId = category_id;
    if (resolvedCategoryId) {
      if (!mongoose.Types.ObjectId.isValid(resolvedCategoryId)) {
        return NextResponse.json(
          { message: "Invalid category id." },
          { status: 400 }
        );
      }

      const exists = await Category.exists({ _id: resolvedCategoryId });
      if (!exists) {
        return NextResponse.json(
          { message: "Category not found." },
          { status: 404 }
        );
      }
    }

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

    const verified = await verifyProgressProof({
      token: proof,
      userId,
      categoryId: resolvedCategoryId,
      kind: "quiz",
    });
    if (!verified.valid) {
      return NextResponse.json(
        { message: "Invalid progress proof." },
        { status: 400 }
      );
    }

    const progress = await TopicProgress.findOneAndUpdate(
      { user_id: userId, category_id: resolvedCategoryId },
      { $set: { quiz_completed: true, updated_at: new Date() } },
      { new: true, upsert: true }
    )
      .select("vocab_completed quiz_completed")
      .lean();

    const completed =
      (progress?.vocab_completed ? 50 : 0) +
      (progress?.quiz_completed ? 50 : 0);

    return NextResponse.json({ data: { progress: completed } });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/progress/quiz",
      publicMessage: "Unable to update progress.",
    });
  }
}
