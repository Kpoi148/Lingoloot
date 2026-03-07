// Authenticated API that signs safe Cloudinary uploads for learners and admins.
import crypto from "crypto";
import { NextResponse } from "next/server";
import { createApiErrorResponse } from "@/lib/security/api-error";
import { requireUserApiSession } from "@/lib/auth/api-auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/request-ip";

export const dynamic = "force-dynamic";

type SignatureRequest = {
  folder?: string;
};

const DEFAULT_BASE_FOLDER = "lingoloot";

const sanitizeFolder = (folder: string) =>
  folder
    .trim()
    .replace(/\\+/g, "/")
    .replace(/\/{2,}/g, "/")
    .replace(/^\//, "")
    .replace(/\/$/, "")
    .replace(/[^a-zA-Z0-9/_-]/g, "");

const getAllowedFolders = () => {
  const fromEnv = process.env.CLOUDINARY_ALLOWED_UPLOAD_FOLDERS
    ?.split(",")
    .map((value) => sanitizeFolder(value))
    .filter(Boolean);

  if (fromEnv && fromEnv.length > 0) {
    return fromEnv;
  }

  const baseFolder =
    sanitizeFolder(process.env.CLOUDINARY_UPLOAD_BASE_FOLDER ?? "") ||
    DEFAULT_BASE_FOLDER;

  return [
    `${baseFolder}/vocab`,
    `${baseFolder}/avatars`,
    `${baseFolder}/shop`,
    `${baseFolder}/users`,
  ];
};

export async function POST(req: Request) {
  try {
    const auth = await requireUserApiSession();
    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const clientIp = getClientIp(req);
    const rateLimit = await checkRateLimit(
      `cloudinary-signature:user:${auth.session.user.id}:ip:${clientIp}`,
      { max: 30, windowMs: 15 * 60 * 1000 }
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

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

    const requestedFolder = sanitizeFolder(
      typeof body?.folder === "string" ? body.folder : ""
    );
    const allowedFolders = getAllowedFolders();
    const baseFolder = sanitizeFolder(process.env.CLOUDINARY_UPLOAD_BASE_FOLDER ?? "") || DEFAULT_BASE_FOLDER;
    const userScopedFolder = `${baseFolder}/users/${auth.session.user.id}`;

    let folder = `${userScopedFolder}/uploads`;
    if (auth.session.user.role === "admin") {
      if (
        requestedFolder &&
        allowedFolders.some(
          (allowed) =>
            requestedFolder === allowed || requestedFolder.startsWith(`${allowed}/`)
        )
      ) {
        folder = requestedFolder;
      }
    } else if (requestedFolder) {
      const suffix = requestedFolder.split("/").filter(Boolean).pop() || "uploads";
      folder = `${userScopedFolder}/${suffix}`;
    }

    const timestamp = Math.round(Date.now() / 1000);

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
    return createApiErrorResponse({
      error,
      scope: "api/cloudinary/signature",
      publicMessage: "Unable to generate upload signature.",
    });
  }
}
