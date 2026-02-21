import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import {
  hashPasswordResetToken,
  isPasswordResetTokenFormat,
} from "@/lib/password-reset";
import { checkRateLimit } from "@/lib/rate-limit";
import { resetPasswordSchema } from "@/lib/validations/auth";
import PasswordResetToken from "@/models/PasswordResetToken";
import User from "@/models/User";

const INVALID_TOKEN_MESSAGE = "Reset token is invalid or has expired.";

const getClientIp = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      token?: string;
      password?: string;
      confirmPassword?: string;
    };

    const parsed = resetPasswordSchema.safeParse({
      token: typeof body.token === "string" ? body.token.trim() : "",
      password: typeof body.password === "string" ? body.password : "",
      confirmPassword:
        typeof body.confirmPassword === "string" ? body.confirmPassword : "",
    });

    if (!parsed.success) {
      const firstIssueMessage = parsed.error.issues[0]?.message;
      return NextResponse.json(
        { message: firstIssueMessage ?? "Invalid input." },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`reset-password:ip:${clientIp}`, {
      max: 10,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    if (!isPasswordResetTokenFormat(parsed.data.token)) {
      return NextResponse.json({ message: INVALID_TOKEN_MESSAGE }, { status: 400 });
    }

    await connectToDatabase();

    const now = new Date();
    const tokenHash = hashPasswordResetToken(parsed.data.token);
    const resetToken = await PasswordResetToken.findOneAndUpdate(
      {
        tokenHash,
        consumedAt: null,
        expiresAt: { $gt: now },
      },
      { $set: { consumedAt: now } },
      { new: true }
    )
      .select("_id userId")
      .lean();

    if (!resetToken) {
      return NextResponse.json({ message: INVALID_TOKEN_MESSAGE }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const userUpdateResult = await User.updateOne(
      { _id: resetToken.userId },
      { $set: { password: passwordHash } }
    );

    if (userUpdateResult.matchedCount === 0) {
      return NextResponse.json({ message: INVALID_TOKEN_MESSAGE }, { status: 400 });
    }

    await PasswordResetToken.updateMany(
      {
        userId: resetToken.userId,
        consumedAt: null,
      },
      { $set: { consumedAt: now } }
    );

    return NextResponse.json(
      { message: "Password has been reset successfully." },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reset password.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
