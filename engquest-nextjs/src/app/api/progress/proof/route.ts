import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import Category from "@/models/Category";
import { connectToDatabase } from "@/lib/db/mongodb";
import {
  createProgressProof,
  type ProgressProofKind,
} from "@/lib/security/progress-proof";

type ProofRequestBody = {
  type?: ProgressProofKind;
  category_id?: string;
  category_slug?: string;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = (await req.json()) as ProofRequestBody;
    const type = body?.type;
    const categoryIdRaw =
      typeof body?.category_id === "string" ? body.category_id.trim() : "";
    const categorySlug =
      typeof body?.category_slug === "string" ? body.category_slug.trim() : "";

    if (type !== "vocab" && type !== "quiz") {
      return NextResponse.json(
        { message: "Invalid progress type." },
        { status: 400 }
      );
    }

    if (!categoryIdRaw && !categorySlug) {
      return NextResponse.json(
        { message: "Category is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let resolvedCategoryId = "";
    if (categoryIdRaw) {
      if (!mongoose.Types.ObjectId.isValid(categoryIdRaw)) {
        return NextResponse.json(
          { message: "Invalid category id." },
          { status: 400 }
        );
      }

      const exists = await Category.exists({ _id: categoryIdRaw });
      if (!exists) {
        return NextResponse.json(
          { message: "Category not found." },
          { status: 404 }
        );
      }
      resolvedCategoryId = categoryIdRaw;
    } else {
      const category = await Category.findOne({ slug: categorySlug })
        .select("_id")
        .lean();
      if (!category?._id) {
        return NextResponse.json(
          { message: "Category not found." },
          { status: 404 }
        );
      }
      resolvedCategoryId = category._id.toString();
    }

    const proof = await createProgressProof({
      userId,
      categoryId: resolvedCategoryId,
      kind: type,
    });

    if (!proof) {
      return NextResponse.json(
        { message: "Unable to create progress proof." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        category_id: resolvedCategoryId,
        type,
        proof,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to generate progress proof.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
