// Hero block that explains the learner promise and routes guests into the study flow.
import {
    ArrowRight,
    BookOpenText,
    ChartNoAxesCombined,
    Gamepad2,
    Gem,
} from "lucide-react";
import TypewriterText from "@/components/landing/TypewriterText";

type HeroSectionProps = {
    onNavigate: (id: string) => void;
};

const pillars = [
    {
        icon: BookOpenText,
        eyebrow: "Topic-based learning",
        title: "Chọn chủ đề rồi đi theo một flow học rõ ràng",
        description:
            "Từ topics sang flashcards, quiz và bài luyện theo đúng nhóm từ đang học.",
    },
    {
        icon: Gamepad2,
        eyebrow: "Retention loop",
        title: "Story Cloze giúp nhớ từ trong ngữ cảnh",
        description:
            "Không chỉ lật thẻ, bạn còn kéo thả từ vào câu chuyện để luyện nhớ chủ động.",
    },
    {
        icon: Gem,
        eyebrow: "Visible rewards",
        title: "XP, Gems và shop hồ sơ giữ nhịp quay lại mỗi ngày",
        description:
            "Hoàn thành bài học để tích thưởng và mở khóa avatar hoặc frame cho profile.",
    },
];

const signals = [
    {
        label: "Một vòng học",
        value: "Topics -> Flashcards -> Quiz",
    },
    {
        label: "Giữ động lực",
        value: "Streak, daily reward, XP",
    },
    {
        label: "Cá nhân hóa",
        value: "Shop, inventory, frame hồ sơ",
    },
];

export default function HeroSection({ onNavigate }: HeroSectionProps) {
    return (
        <section id="hero" className="space-y-8 scroll-mt-32 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-slate-600 shadow-sm shadow-slate-950/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">
                Learner-first landing
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>

            <div className="space-y-5">
                <h1 className="max-w-4xl font-[var(--font-display)] text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                    <span className="sr-only">

                    </span>
                    <span aria-hidden="true">
    
                        <span className="bg-[linear-gradient(135deg,#0f172a_0%,#2563eb_45%,#10b981_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(135deg,#f8fafc_0%,#7dd3fc_35%,#6ee7b7_100%)]">

                        </span>
                        <br className="hidden md:block" />
                        <TypewriterText
                            className="mt-2 text-balance text-slate-950 dark:text-white"
                            phrases={[
                            ]}
                        />
                    </span>
                </h1>
                <p className="max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                    Bắt đầu từ topic, học bằng flashcards, kiểm tra bằng quiz
                    và Story Cloze, rồi dùng XP, streak và Gems để mở khóa hồ
                    sơ mang dấu ấn riêng. Mọi thứ đi theo một vòng học ngắn, rõ
                    tiến độ và đủ vui để quay lại.
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={() => onNavigate("register")}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.75)] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:shadow-[0_18px_45px_-28px_rgba(255,255,255,0.35)] dark:hover:bg-slate-100"
                >
                    Tạo tài khoản miễn phí
                    <ArrowRight className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => onNavigate("flow")}
                    className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:text-white"
                >
                    Xem lộ trình học
                </button>
                <button
                    type="button"
                    onClick={() => onNavigate("login")}
                    className="inline-flex items-center justify-center rounded-full px-2 py-3 text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                    Tôi đã có tài khoản
                </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {pillars.map((pillar) => {
                    const Icon = pillar.icon;

                    return (
                        <article
                            key={pillar.title}
                            className="landing-subtle-panel rounded-[1.6rem] p-5"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-100">
                                <Icon className="h-5 w-5" />
                            </span>
                            <p className="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                                {pillar.eyebrow}
                            </p>
                            <h2 className="mt-3 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                                {pillar.title}
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {pillar.description}
                            </p>
                        </article>
                    );
                })}
            </div>

            <div className="flex flex-wrap gap-6 border-t border-black/10 pt-6 text-sm dark:border-white/10">
                {signals.map((signal) => (
                    <div key={signal.label} className="min-w-[180px]">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                            {signal.label}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-slate-700 dark:text-slate-200">
                            <ChartNoAxesCombined className="h-4 w-4 text-emerald-500" />
                            <span className="font-medium">{signal.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
