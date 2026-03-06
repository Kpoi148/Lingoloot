import Link from "next/link";
import { unstable_cache } from "next/cache";
import Game from "@/models/Game";
import { connectToDatabase } from "@/lib/db/mongodb";

type GameListItem = {
  _id: string;
  title: string;
  topicName: string;
  createdAt?: Date;
};

const getActiveGames = unstable_cache(
  async (): Promise<GameListItem[]> => {
    await connectToDatabase();
    const games = await Game.find({ status: "active" })
      .select("title topicName createdAt")
      .sort({ createdAt: -1 })
      .lean();
    return games.map((game) => ({
      _id: game._id.toString(),
      title: game.title,
      topicName: game.topicName,
      createdAt: game.createdAt,
    }));
  },
  ["games:list"],
  { revalidate: 60 }
);

const formatDate = (value?: Date) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN");
};

export default async function PracticeListPage() {
  const games = await getActiveGames();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Tro choi
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Danh sach Story Cloze
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Chon mot tro choi de bat dau luyen tap.
          </p>
        </div>

        {games.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-8 text-center text-sm text-slate-500">
            Chua co tro choi nao duoc kich hoat.
          </div>
        )}

        {games.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {games.map((game) => (
              <Link
                key={game._id}
                href={`/learn/practice/${game._id}`}
                className="group relative flex flex-col rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute right-4 top-4 h-10 w-10 rounded-2xl bg-amber-100/70 blur-2xl transition group-hover:scale-110" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  {game.topicName}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">
                  {game.title}
                </h2>
                {game.createdAt && (
                  <p className="mt-3 text-xs text-slate-400">
                    {formatDate(game.createdAt)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
