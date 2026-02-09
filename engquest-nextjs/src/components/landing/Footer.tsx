import { AnimatedSection } from "@/components/common/AnimatedSection";

type FooterProps = {
    onNavigate: (id: string) => void;
};

export default function Footer({ onNavigate }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <AnimatedSection className="relative mx-auto w-full max-w-6xl px-4 pb-12">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-6 py-10 text-slate-100 shadow-2xl shadow-slate-900/40 sm:px-10 sm:py-12">
                {/* Decorative blobs */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-12 -top-16 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-20 right-8 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl"
                />

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Brand */}
                    <div className="space-y-3">
                        <p className="font-[var(--font-display)] text-2xl font-semibold tracking-tight">
                            LingoLoot
                        </p>
                        <p className="text-sm text-slate-300">
                            Học nhanh, nhàn hạ, vui vẻ.
                        </p>
                    </div>

                    {/* Explore Links */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                            Khám phá
                        </p>
                        <div className="mt-4 flex flex-col gap-2 text-sm text-slate-200">
                            <button
                                type="button"
                                onClick={() => onNavigate("features")}
                                className="text-left transition hover:text-white"
                            >
                                Tính năng
                            </button>
                            <button
                                type="button"
                                onClick={() => onNavigate("how-it-works")}
                                className="text-left transition hover:text-white"
                            >
                                Cách học
                            </button>
                            <button
                                type="button"
                                onClick={() => onNavigate("register")}
                                className="text-left transition hover:text-white"
                            >
                                Đăng ký
                            </button>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                            Liên hệ
                        </p>
                        <div className="mt-4 flex flex-col gap-2 text-sm text-slate-200">
                            <a
                                href="mailto:support@lingoloot.com"
                                className="transition hover:text-white"
                            >
                                support@lingoloot.com
                            </a>
                            <a
                                href="https://github.com/Kpoi148"
                                target="_blank"
                                rel="noreferrer"
                                className="transition hover:text-white"
                            >
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <span>© {currentYear} LingoLoot. All rights reserved.</span>
                    <span>Thiết kế cho người học tiếng Anh.</span>
                </div>
            </div>
        </AnimatedSection>
    );
}
