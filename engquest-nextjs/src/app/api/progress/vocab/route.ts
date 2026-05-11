// Authenticated API for marking vocabulary study progress.
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireUserApiSession } from "@/lib/auth/api-auth";
import { createApiErrorResponse } from "@/lib/security/api-error";
import Category from "../../../../models/Category";
import TopicProgress from "../../../../models/TopicProgress";
import { connectToDatabase } from "@/lib/db/mongodb";
import { verifyProgressProof } from "@/lib/security/progress-proof";

export async function POST(req: Request) {
  try {
    const auth = await requireUserApiSession();
    if (!auth.ok) {
      return NextResponse.json(
        { message: auth.message },
        { status: auth.status }
      );
    }

    const body = await req.json();
    const category_id =
      typeof body?.category_id === "string" ? body.category_id.trim() : "";
    const proof = typeof body?.proof === "string" ? body.proof.trim() : "";

    if (!category_id) {
      return NextResponse.json(
        { message: "Category is required." },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(category_id)) {
      return NextResponse.json(
        { message: "Invalid category id." },
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

    const categoryExists = await Category.exists({ _id: category_id });
    if (!categoryExists) {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 }
      );
    }

    const verified = await verifyProgressProof({
      token: proof,
      userId: auth.session.user.id,
      categoryId: category_id,
      kind: "vocab",
    });
    if (!verified.valid) {
      return NextResponse.json(
        { message: "Invalid progress proof." },
        { status: 400 }
      );
    }

    const progress = await TopicProgress.findOneAndUpdate(
      { user_id: auth.session.user.id, category_id },
      { $set: { vocab_completed: true, updated_at: new Date() } },
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
      scope: "api/progress/vocab",
      publicMessage: "Unable to update progress.",
    });
  }
}
