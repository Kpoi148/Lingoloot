// Learner practice session page for a specific practice item.
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import StoryClozeGame from "@/components/game/StoryClozeGame";
import Game from "@/models/Game";
import { connectToDatabase } from "@/lib/db/mongodb";

type GameData = {
  id: string;
  title: string;
  content: Array<{
    text: string;
    type: "text" | "gap";
    answer?: string;
  }>;
  distractors: string[];
};

const getGameById = unstable_cache(
  async (id: string): Promise<GameData | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    await connectToDatabase();
    const game = await Game.findOne({ _id: id, status: "active" })
      .select("title content distractors")
      .lean();

    if (!game) return null;

    return {
      id: game._id.toString(),
      title: game.title,
      content: (game.content ?? []).map((item) => ({
        text: item.text ?? "",
        type: item.type ?? "text",
        answer: item.answer ?? undefined,
      })),
      distractors: game.distractors ?? [],
    };
  },
  ["learn-practice-game"],
  { revalidate: 60 }
);

export default async function PracticeGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGameById(id);

  if (!game) {
    notFound();
  }

  return (
    <StoryClozeGame
      initialGame={game}
      exitHref="/learn/practice"
      exitLabel="Về khu trò chơi"
    />
  );
}
