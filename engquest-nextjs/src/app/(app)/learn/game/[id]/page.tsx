// Story Cloze gameplay page for completing a specific game session.
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import StoryClozeGame from "@/components/game/StoryClozeGame";
import type { StoryClozeGameData } from "@/components/game/story-cloze/types";
import { connectToDatabase } from "@/lib/db/mongodb";
import Game from "@/models/Game";

const getActiveStoryClozeGame = unstable_cache(
  async (id: string): Promise<StoryClozeGameData | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    await connectToDatabase();
    const game = await Game.findOne({ _id: id, status: "active" })
      .select("title content distractors")
      .lean();

    if (!game) {
      return null;
    }

    return {
      id: String(game._id),
      title: game.title,
      content: (game.content ?? []).map((item) => ({
        text: item.text ?? "",
        type: item.type ?? "text",
        answer: item.answer ?? undefined,
      })),
      distractors: game.distractors ?? [],
    };
  },
  ["learn-game-story-cloze"],
  { revalidate: 60 }
);

export default async function LearnGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getActiveStoryClozeGame(id);

  if (!game) {
    notFound();
  }

  return (
    <StoryClozeGame
      initialGame={game}
      exitHref="/"
      exitLabel="Back to home"
    />
  );
}
