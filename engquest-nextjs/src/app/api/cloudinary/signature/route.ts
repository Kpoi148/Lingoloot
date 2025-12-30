import crypto from "crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type SignatureRequest = {
  folder?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SignatureRequest;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { message: "Missing Cloudinary configuration." },
        { status: 500 }
      );
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder =
      typeof body?.folder === "string" ? body.folder.trim() : "";

    const paramsToSign: Record<string, string | number> = { timestamp };
    if (folder) {
      paramsToSign.folder = folder;
    }

    const signatureBase = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join("&");
    const signature = crypto
      .createHash("sha1")
      .update(signatureBase + apiSecret)
      .digest("hex");

    return NextResponse.json({
      timestamp,
      signature,
      apiKey,
      cloudName,
      folder: folder || undefined,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to generate upload signature.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
