// Hero block that explains the learner promise and routes guests into the study flow.
import {
    ArrowRight,
    BookOpenText,
    Gamepad2,
    Gem,
} from "lucide-react";
import {
    landingActions,
    landingHeroHighlights,
    landingHeroPillars,
} from "@/components/landing/content";
import TypewriterText from "@/components/landing/TypewriterText";

type HeroSectionProps = {
    onNavigate: (id: string) => void;
};

const pillarIcons = [BookOpenText, Gamepad2, Gem];

export default function HeroSection({ onNavigate }: HeroSectionProps) {
    return (
        <section id="hero" className="space-y-8 scroll-mt-32 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-slate-600 shadow-sm shadow-slate-950/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">
                Lingoloot
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>

            <div className="space-y-5">
                <h1 className="max-w-4xl font-[var(--font-display)] text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                    <span className="sr-only">
                        LingoLoot: học mê, nhớ dễ, tiến đều mỗi ngày.
                    </span>
                    <span aria-hidden="true">
                        <span className="bg-[linear-gradient(135deg,#0f172a_0%,#2563eb_45%,#10b981_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(135deg,#f8fafc_0%,#7dd3fc_35%,#6ee7b7_100%)]">
                            LingoLoot
                        </span>
                        : học mê, nhớ dễ,
                        <br className="hidden md:block" />
                        <TypewriterText
                            className="mt-2 text-balance text-slate-950 dark:text-white"
                            phrases={[
                                "tiến đều mỗi ngày.",
                                "giữ streak thật đều.",
                                "lên trình theo từng ngày.",
                            ]}
                        />
                    </span>
                </h1>
                <p className="max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                    LingoLoot dẫn người học qua một flow ngắn gọn: chọn đúng
                    topic, ghi nhớ bằng flashcards, kiểm tra lại bằng quiz, rồi
                    khóa phiên học bằng Story Cloze trước khi phần thưởng và
                    progress được cập nhật về profile.
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={() => onNavigate(landingActions.primary.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.75)] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:shadow-[0_18px_45px_-28px_rgba(255,255,255,0.35)] dark:hover:bg-slate-100"
                >
                    {landingActions.primary.label}
                    <ArrowRight className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => onNavigate(landingActions.tertiary.id)}
                    className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:text-white"
                >
                    {landingActions.tertiary.label}
                </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {landingHeroPillars.map((pillar, index) => {
                    const Icon = pillarIcons[index];

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
                {landingHeroHighlights.map((signal) => (
                    <div key={signal.label} className="min-w-[180px]">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                            {signal.label}
                        </p>
                        <p className="mt-2 font-medium text-slate-700 dark:text-slate-200">
                            {signal.value}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
