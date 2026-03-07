// Landing section that explains the step-by-step learner study loop.
import {
    BookOpenText,
    BrainCircuit,
    Gamepad2,
    Layers3,
    Route,
} from "lucide-react";
import { AnimatedSection } from "@/components/common/AnimatedSection";

const steps = [
    {
        icon: Layers3,
        step: "01",
        title: "Chọn topic phù hợp với mục tiêu hiện tại",
        description:
            "Bắt đầu từ danh sách chủ đề thay vì nhảy vào một bộ từ rời rạc.",
    },
    {
        icon: BookOpenText,
        step: "02",
        title: "Lật flashcards và tra nghĩa theo ngữ cảnh",
        description:
            "Ôn phát âm, nghĩa và ví dụ trực tiếp để tạo nền nhớ ban đầu.",
    },
    {
        icon: BrainCircuit,
        step: "03",
        title: "Kiểm tra lại bằng quiz ngắn theo chính bộ từ đó",
        description:
            "Cùng một nội dung được lặp lại ở dạng câu hỏi để tăng retention.",
    },
    {
        icon: Gamepad2,
        step: "04",
        title: "Khóa phiên học bằng Story Cloze và lưu progress",
        description:
            "Từ đi từ thẻ sang câu chuyện, giúp bạn nhớ theo ngữ cảnh sử dụng.",
    },
];

export default function HowItWorksSection() {
    return (
        <AnimatedSection
            id="flow"
            className="relative mx-auto w-full max-w-7xl scroll-mt-32 px-4 pb-24 sm:px-6 lg:px-8"
        >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl space-y-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
                        Learning flow
                    </p>
                    <h2 className="font-[var(--font-display)] text-3xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white sm:text-4xl">
                        Một vòng học gọn, rõ và đủ ngắn để bạn quay lại vào
                        ngày mai.
                    </h2>
                    <p className="text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                        Landing chỉ nói về learner flow thực tế của dự án:
                        topics, flashcards, quiz, Story Cloze và progress.
                    </p>
                </div>
                <div className="landing-subtle-panel flex items-center gap-4 rounded-[1.6rem] px-5 py-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-100">
                        <Route className="h-5 w-5" />
                    </span>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            Thiết kế cho phiên học 10-15 phút
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            Mỗi bước tái sử dụng cùng bộ từ để không làm người
                            học bị đứt mạch.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-4">
                {steps.map((item) => {
                    const Icon = item.icon;

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

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <article className="landing-panel rounded-[1.8rem] p-6">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                        Flow continuity
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                        Cùng một bộ từ được củng cố qua nhiều bề mặt học khác
                        nhau.
                    </h3>
                    <div className="mt-6 space-y-4">
                        {[
                            ["Topics", "Chọn bộ từ đang cần"],
                            ["Flashcards", "Tạo ghi nhớ ban đầu"],
                            ["Quiz", "Kiểm tra recall tức thời"],
                            ["Story Cloze", "Gắn từ vào ngữ cảnh"],
                        ].map(([label, value], index) => (
                            <div
                                key={label}
                                className="grid gap-3 sm:grid-cols-[140px_1fr]"
                            >
                                <div className="text-sm font-semibold text-slate-950 dark:text-white">
                                    {index + 1}. {label}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        {value}
                                    </p>
                                    <div className="mt-2 h-2 rounded-full bg-black/5 dark:bg-white/10">
                                        <div
                                            className="h-2 rounded-full bg-[linear-gradient(90deg,#0f172a_0%,#2563eb_55%,#10b981_100%)] dark:bg-[linear-gradient(90deg,#f8fafc_0%,#7dd3fc_50%,#6ee7b7_100%)]"
                                            style={{ width: `${55 + index * 12}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="landing-subtle-panel rounded-[1.8rem] p-6">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                        What this solves
                    </p>
                    <div className="mt-4 space-y-3">
                        {[
                            "Không cần đoán bước tiếp theo sau khi học một từ.",
                            "Người học nhìn thấy tiến độ thay vì học rời rạc.",
                            "Story Cloze đóng vai trò cầu nối giữa ghi nhớ và sử dụng.",
                        ].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </article>
            </div>
        </AnimatedSection>
    );
}
