import Link from "next/link";
import { BookA, BrainCircuit, Gamepad2, Wand2 } from "lucide-react";

export const dynamic = "force-dynamic";

const features = [
  {
    title: "Magic Vocabulary",
    description: "Tạo chi tiết từ vựng, IPA, ví dụ từ một từ khóa.",
    href: "/admin/ai-hub/vocabulary",
    icon: BookA,
    accent: "from-indigo-500 to-sky-400",
  },
  {
    title: "Game Builder",
    description: "Tạo Story Cloze game từ chủ đề và từ vựng đã có.",
    href: "/admin/ai-hub/games",
    icon: Gamepad2,
    accent: "from-emerald-500 to-teal-400",
  },
  {
    title: "Quiz Master",
    description: "Tự động sinh bộ câu hỏi trắc nghiệm từ chủ đề.",
    href: "/admin/ai-hub/quizzes",
    icon: BrainCircuit,
    accent: "from-indigo-500 to-rose-400",
  },
  {
    title: "Frame Generator",
    description: "Thiết kế khung viền Avatar độc quyền với AI.",
    href: "/admin/ai-hub/frames",
    icon: Wand2,
    accent: "from-amber-500 to-orange-400",
  },
];

export default function AdminAIHubPage() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60">
        <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-indigo-100/70 blur-3xl" />
        <div className="absolute -bottom-28 left-12 h-52 w-52 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-400">
            AI Studio
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            AI Content Generator
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Chọn loại nội dung bạn muốn khởi tạo.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative flex h-full flex-col gap-4 rounded-3xl border border-indigo-200/80 bg-white/90 p-6 shadow-lg shadow-slate-200/50 transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} text-white shadow-md`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {feature.description}
                </p>
              </div>
              <span className="mt-auto text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400">
                Truy cập
              </span>
              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition group-hover:opacity-100">
                <div className="absolute inset-0 rounded-3xl ring-1 ring-indigo-300/40" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
