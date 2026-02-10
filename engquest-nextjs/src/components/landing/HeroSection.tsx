import { Gamepad2, ShoppingBag } from "lucide-react";

export default function HeroSection() {
    return (
        <section id="hero" className="flex-1 space-y-6 scroll-mt-28 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-sm dark:bg-white dark:text-slate-900">
                LingoLoot
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 dark:bg-emerald-400" />
            </span>
            <div className="space-y-4">
                <h1 className="font-[var(--font-display)] text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
                    Vốn từ vựng
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-lg">
                    Nền tảng học tập tối giản giúp bạn{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                        nắm vững từ vựng qua Flashcard trực quan
                    </span>
                    , thử thách bản thân qua{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                        Quiz và minigame Story Cloze
                    </span>
                    .
                </p>
            </div>

            {/* Feature Cards */}
            <div
                id="features"
                className="grid max-w-lg scroll-mt-28 grid-cols-1 gap-4 sm:grid-cols-2"
            >
                <FeatureCard
                    icon={<Gamepad2 className="h-5 w-5" />}
                    title="Story Cloze"
                    description="Kéo thả từ vào khoảng trống để hoàn thành câu chuyện - học từ trong ngữ cảnh thực tế."
                    color="emerald"
                />
                <FeatureCard
                    icon={<ShoppingBag className="h-5 w-5" />}
                    title="Gem & Shop"
                    description="Kiếm Gem khi hoàn thành bài học, đổi lấy Avatar và Frame độc quyền cho hồ sơ."
                    color="amber"
                />
            </div>
        </section>
    );
}

type FeatureCardProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: "emerald" | "amber";
};

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
    const colorClasses = {
        emerald: {
            bg: "bg-emerald-100 dark:bg-emerald-500/20",
            text: "text-emerald-600 dark:text-emerald-400",
        },
        amber: {
            bg: "bg-amber-100 dark:bg-amber-500/20",
            text: "text-amber-600 dark:text-amber-400",
        },
    };

    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-slate-950/40">
            <div className="flex items-center gap-3">
                <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${colorClasses[color].bg} ${colorClasses[color].text}`}
                >
                    {icon}
                </span>
                <p
                    className={`text-xs font-semibold uppercase tracking-[0.25em] ${colorClasses[color].text}`}
                >
                    {title}
                </p>
            </div>
            <p className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
                {description}
            </p>
        </div>
    );
}
