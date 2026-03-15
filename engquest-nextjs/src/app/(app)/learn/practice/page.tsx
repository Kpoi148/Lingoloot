// Practice hub page for loading standalone learner practice items.
import { unstable_cache } from "next/cache";
import PracticeHubClient from "@/components/practice/PracticeHubClient";
import type { PracticeGameRecord } from "@/components/practice/types";
import {
  buildPracticePreview,
  countPracticeGaps,
  estimatePracticeMinutes,
} from "@/components/practice/utils";
import Game from "@/models/Game";
import { connectToDatabase } from "@/lib/db/mongodb";

const getActiveGames = unstable_cache(
  async (): Promise<PracticeGameRecord[]> => {
    await connectToDatabase();
    const games = await Game.find({ status: "active" })
      .select("title topicName content distractors createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return games.map((game) => {
      const gapCount = countPracticeGaps(game.content ?? []);
      const distractorCount = game.distractors?.length ?? 0;
      const createdAt =
        game.createdAt instanceof Date &&
        !Number.isNaN(game.createdAt.getTime())
          ? game.createdAt.toISOString()
          : null;

      return {
        id: game._id.toString(),
        title: game.title,
        topicName: game.topicName,
        gapCount,
        distractorCount,
        estimatedMinutes: estimatePracticeMinutes(gapCount, distractorCount),
        preview: buildPracticePreview(game.content ?? []),
        createdAt,
      } satisfies PracticeGameRecord;
    });
  },
  ["games:list"],
  { revalidate: 60 }
);

export default async function PracticeListPage() {
  const games = await getActiveGames();

  return <PracticeHubClient games={games} />;
}
