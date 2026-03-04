import { NextResponse } from "next/server";
import { createApiErrorResponse } from "@/lib/api-error";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { connectToDatabase } from "@/lib/mongodb";
import {
  buildPasswordResetUrl,
  createPasswordResetToken,
} from "@/lib/password-reset";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import PasswordResetToken from "@/models/PasswordResetToken";
import User from "@/models/User";

const GENERIC_SUCCESS_MESSAGE =
  "If the email exists, a password reset link has been sent.";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { email?: string };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      return NextResponse.json({ message: GENERIC_SUCCESS_MESSAGE }, { status: 200 });
    }

    const clientIp = getClientIp(request);
    const ipLimit = await checkRateLimit(`forgot-password:ip:${clientIp}`, {
      max: 20,
      windowMs: 15 * 60 * 1000,
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(ipLimit.retryAfterSeconds) },
        }
      );
    }

    const accountLimit = await checkRateLimit(
      `forgot-password:ip-email:${clientIp}:${parsed.data.email}`,
      {
        max: 5,
        windowMs: 15 * 60 * 1000,
      }
    );
    if (!accountLimit.allowed) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(accountLimit.retryAfterSeconds) },
        }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: parsed.data.email })
      .select("_id email name isBanned")
      .lean();
    if (!user || user.isBanned) {
      return NextResponse.json({ message: GENERIC_SUCCESS_MESSAGE }, { status: 200 });
    }

    const now = new Date();

    await PasswordResetToken.updateMany(
      {
        userId: user._id,
        consumedAt: null,
        expiresAt: { $gt: now },
      },
      { $set: { consumedAt: now } }
    );

    const { token, tokenHash, expiresAt } = createPasswordResetToken(now);
    const userAgent = request.headers.get("user-agent")?.slice(0, 500) || "";
    const createdToken = await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
      requestedIp: clientIp,
      userAgent,
    });

    const resetUrl = buildPasswordResetUrl(token, request.url);
    const emailResult = await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    });

    if (!emailResult.ok) {
      await PasswordResetToken.updateOne(
        { _id: createdToken._id },
        { $set: { consumedAt: new Date() } }
      );
      console.error("Unable to send password reset email:", emailResult.error);
    }

    return NextResponse.json({ message: GENERIC_SUCCESS_MESSAGE }, { status: 200 });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/auth/forgot-password",
      publicMessage: "Unable to process request.",
      status: 400,
    });
  }
}
