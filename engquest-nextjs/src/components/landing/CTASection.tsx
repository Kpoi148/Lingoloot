import { AnimatedSection } from "@/components/common/AnimatedSection";

type CTASectionProps = {
    onNavigate: (id: string) => void;
};

export default function CTASection({ onNavigate }: CTASectionProps) {
    return (
        <AnimatedSection className="relative mx-auto w-full max-w-6xl px-4 pb-28">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-12 text-white shadow-2xl shadow-indigo-500/30 dark:from-indigo-500 dark:to-sky-500 dark:shadow-indigo-500/20 sm:px-10 sm:py-14">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                            Sẵn sàng bắt đầu?
                        </p>
                        <h2 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
                            Sẵn sàng bứt phá vốn từ vựng?
                        </h2>
                        <p className="max-w-xl text-base text-white/85 sm:text-lg">
                            Tạo tài khoản miễn phí và để LingoLoot biến việc học trở nên nhẹ nhàng hơn.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onNavigate("register")}
                        className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-indigo-700 shadow-lg shadow-indigo-900/20 transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-50 dark:bg-white dark:text-indigo-700 dark:hover:bg-indigo-50 sm:px-8 sm:py-4 sm:text-lg"
                    >
                        Tạo tài khoản miễn phí
                    </button>
                </div>
            </div>
        </AnimatedSection>
    );
}
