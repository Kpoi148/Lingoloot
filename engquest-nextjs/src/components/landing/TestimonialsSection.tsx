import { Star } from "lucide-react";
import { AnimatedSection } from "@/components/common/AnimatedSection";

const testimonials = [
    {
        quote: "Học từ vựng chưa bao giờ nhàn thế này!",
        name: "Minh Anh",
        role: "Sinh viên năm 3",
        initials: "MA",
    },
    {
        quote: "AI thông minh quá, lấy ví dụ rất chuẩn.",
        name: "Hoàng Long",
        role: "Nhân viên văn phòng",
        initials: "HL",
    },
    {
        quote: "Bài quiz bám sát từ mình học nên tiến bộ nhanh.",
        name: "Thu Hà",
        role: "Giáo viên tiếng Anh",
        initials: "TH",
    },
];

export default function TestimonialsSection() {
    return (
        <AnimatedSection className="relative mx-auto w-full max-w-6xl px-4 pb-24">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                        Trusted by learners
                    </p>
                    <h2 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                        Người học nói gì về LingoLoot?
                    </h2>
                </div>
                <div className="rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-300">
                    5.0/5 trung bình
                </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
                {testimonials.map((item, index) => (
                    <TestimonialCard key={item.name} item={item} index={index} />
                ))}
            </div>
        </AnimatedSection>
    );
}

type TestimonialCardProps = {
    item: (typeof testimonials)[number];
    index: number;
};

function TestimonialCard({ item, index }: TestimonialCardProps) {
    return (
        <div
            className="rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-xl shadow-slate-200/60 dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-slate-950/40"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                        key={`${item.name}-star-${starIndex}`}
                        className="h-4 w-4 text-amber-400 dark:text-amber-300"
                        fill="currentColor"
                    />
                ))}
            </div>
            <p className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
                &ldquo;{item.quote}&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-sky-400 text-sm font-bold text-white">
                    {item.initials}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.role}
                    </p>
                </div>
            </div>
        </div>
    );
}
