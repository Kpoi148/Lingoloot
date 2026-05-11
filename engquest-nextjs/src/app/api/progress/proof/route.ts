// Authenticated API that mints a proof token before progress can be written.
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireUserApiSession } from "@/lib/auth/api-auth";
import Category from "@/models/Category";
import { connectToDatabase } from "@/lib/db/mongodb";
import { createApiErrorResponse } from "@/lib/security/api-error";
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
    const auth = await requireUserApiSession();
    if (!auth.ok) {
      return NextResponse.json(
        { message: auth.message },
        { status: auth.status }
      );
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
      userId: auth.session.user.id,
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
    return createApiErrorResponse({
      error,
      scope: "api/progress/proof",
      publicMessage: "Unable to generate progress proof.",
    });
  }
}
