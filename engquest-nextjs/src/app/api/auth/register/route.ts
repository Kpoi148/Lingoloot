import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { createApiErrorResponse } from "@/lib/api-error";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import User from "../../../../models/User";
import { connectToDatabase } from "../../../../lib/mongodb";

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const ipLimit = await checkRateLimit(`register:ip:${clientIp}`, {
      max: 10,
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

    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return NextResponse.json({ message: "Email already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      ...(name ? { name } : {}),
      email,
      password: hashedPassword,
      role: "user",
    });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    const mongoError = error as { code?: number };
    if (mongoError?.code === 11000) {
      return NextResponse.json({ message: "Email already exists." }, { status: 400 });
    }

    return createApiErrorResponse({
      error,
      scope: "api/auth/register",
      publicMessage: "Unable to create user.",
      status: 400,
    });
  }
}
