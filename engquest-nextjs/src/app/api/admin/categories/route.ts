import { NextResponse } from "next/server";
import { createApiErrorResponse } from "@/lib/security/api-error";
import { requireAdminApiSession } from "@/lib/auth/api-auth";
import Category from "../../../../models/Category";
import { connectToDatabase } from "@/lib/db/mongodb";

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
      ? {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { slug: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    await connectToDatabase();

    const categories = await Category.find(filter)
      .sort({ order: 1 })
      .select("name slug description image_url order count")
      .lean();

    const data = categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
    }));

    return NextResponse.json({ data });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/admin/categories:GET",
      publicMessage: "Unable to load categories.",
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

    const created = await Category.create({
      name,
      slug: slug.toLowerCase(),
      description: description || undefined,
      image_url: image_url || undefined,
      order: Number.isFinite(order) ? order : 0,
      count: Number.isFinite(count) ? count : undefined,
    });

    return NextResponse.json({ data: { _id: created._id.toString() } });
  } catch (error) {
    const mongoError = error as { code?: number };
    if (mongoError?.code === 11000) {
      return NextResponse.json({ message: "Slug already exists." }, { status: 400 });
    }
    return createApiErrorResponse({
      error,
      scope: "api/admin/categories:POST",
      publicMessage: "Unable to create category.",
    });
  }
}
