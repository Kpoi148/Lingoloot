// Landing closeout section that pushes guests into login or registration.
import { AnimatedSection } from "@/components/common/AnimatedSection";

type CTASectionProps = {
    onNavigate: (id: string) => void;
};

export default function CTASection({ onNavigate }: CTASectionProps) {
    return (
        <AnimatedSection className="relative mx-auto w-full max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#050816] px-6 py-12 text-white shadow-[0_32px_90px_-44px_rgba(2,6,23,0.9)] sm:px-10 sm:py-14">
                <div
                    aria-hidden="true"
                    className="landing-grid absolute inset-0 opacity-20"
                />
                <div
                    aria-hidden="true"
                    className="absolute -left-12 top-6 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="absolute -right-8 bottom-0 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl"
                />

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-4">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-white/60">
                            Ready to start
                        </p>
                        <h2 className="max-w-3xl font-[var(--font-display)] text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                            Đặt streak đầu tiên cho hôm nay và để phần còn lại
                            chạy theo flow có sẵn.
                        </h2>
                        <p className="max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                            Tạo tài khoản để vào topics, bắt đầu flashcards,
                            hoàn thành quiz đầu tiên và tích Gem cho profile của
                            bạn.
                        </p>

                        <div className="flex flex-wrap gap-2 text-xs font-medium text-white/70">
                            {[
                                "Topics theo chủ đề",
                                "Flashcards + quiz",
                                "Story Cloze",
                                "Streak + daily reward",
                            ].map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => onNavigate("register")}
                            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-950 shadow-[0_18px_45px_-28px_rgba(255,255,255,0.45)] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100 sm:px-8 sm:py-4"
                        >
                            Tạo tài khoản miễn phí
                        </button>
                        <button
                            type="button"
                            onClick={() => onNavigate("login")}
                            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 text-base font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.08] sm:px-8 sm:py-4"
                        >
                            Tôi đã có tài khoản
                        </button>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}
