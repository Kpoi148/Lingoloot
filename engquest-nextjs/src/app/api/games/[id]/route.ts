import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { createApiErrorResponse } from "@/lib/api-error";
import Game from "@/models/Game";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid game id." }, { status: 400 });
    }

    await connectToDatabase();

    const game = await Game.findOne({ _id: id, status: "active" })
      .select("title content distractors")
      .lean();

    if (!game) {
      return NextResponse.json({ message: "Game not found." }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        _id: game._id.toString(),
        title: game.title,
        content: game.content ?? [],
        distractors: game.distractors ?? [],
      },
    });
  } catch (error) {
    return createApiErrorResponse({
      error,
      scope: "api/games/[id]",
      publicMessage: "Unable to load game.",
    });
  }
}
