import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import User from "../../../../models/User";
import { connectToDatabase } from "../../../../lib/mongodb";

export async function POST(req: Request) {
  try {
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

    const message =
      error instanceof Error ? error.message : "Unable to create user.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
