// Landing section that explains the learner study loop once, clearly and compactly.
import {
    BookOpenText,
    BrainCircuit,
    Gamepad2,
    Layers3,
} from "lucide-react";
import { AnimatedSection } from "@/components/common/AnimatedSection";
import { landingFlowSteps } from "@/components/landing/content";

const stepIcons = [Layers3, BookOpenText, BrainCircuit, Gamepad2];

export default function HowItWorksSection() {
    return (
        <AnimatedSection
            id="flow"
            className="relative mx-auto w-full max-w-7xl scroll-mt-32 px-4 pb-24 sm:px-6 lg:px-8"
        >
            <div className="max-w-3xl space-y-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
                    Learning flow
                </p>
                <h2 className="font-[var(--font-display)] text-3xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white sm:text-4xl">
                    Một vòng học ngắn, đủ rõ để người học luôn biết bước tiếp
                    theo là gì.
                </h2>
                <p className="text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                    Thay vì lặp lại cùng nội dung ở nhiều section, landing nên
                    giải thích flow một lần thật rõ: từ topic sang ghi nhớ,
                    kiểm tra lại, rồi khóa phiên học bằng ngữ cảnh.
                </p>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-4">
                {landingFlowSteps.map((item, index) => {
                    const Icon = stepIcons[index];

                    return (
                        <article
                            key={item.step}
                            className="landing-subtle-panel rounded-[1.7rem] p-5"
                        >
                            <div className="flex items-center justify-between">
                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-100">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-slate-400 dark:text-slate-500">
                                    {item.step}
                                </span>
                            </div>
                            <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {item.description}
                            </p>
                        </article>
                    );
                })}
            </div>

            <div className="mt-6 landing-subtle-panel rounded-[1.8rem] p-6">
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Mỗi bước dùng lại cùng một bộ từ để người học không cần tự
                    quyết định lại flow sau mỗi thao tác nhỏ. Đây là phần nên
                    được giải thích một lần thật gọn, thay vì nhắc lại ở khắp
                    landing page.
                </p>
            </div>
        </AnimatedSection>
    );
}
