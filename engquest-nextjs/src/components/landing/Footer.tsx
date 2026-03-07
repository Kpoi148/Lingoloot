// Landing footer with final navigation and auth entry links.
import BrandLogo from "@/components/common/BrandLogo";
import { AnimatedSection } from "@/components/common/AnimatedSection";

type FooterProps = {
    onNavigate: (id: string) => void;
};

export default function Footer({ onNavigate }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <AnimatedSection className="relative mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,#020617_0%,#0f172a_55%,#111827_100%)] px-6 py-10 text-slate-100 shadow-[0_32px_90px_-48px_rgba(2,6,23,0.92)] sm:px-10 sm:py-12">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-12 -top-16 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-20 right-8 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="landing-grid absolute inset-0 opacity-15"
                />

                <div className="relative grid gap-8 md:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,0.8fr))]">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                                <BrandLogo
                                    className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl"
                                    size={36}
                                />
                            </span>
                            <div>
                                <p className="font-[var(--font-display)] text-2xl font-semibold tracking-tight">
                                    LingoLoot
                                </p>
                                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                                    Learner experience
                                </p>
                            </div>
                        </div>
                        <p className="max-w-sm text-sm leading-6 text-slate-300">
                            Landing tập trung hoàn toàn vào hành trình của
                            learner: học từ, luyện quiz, giữ streak và cá nhân
                            hóa hồ sơ.
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                            Khám phá
                        </p>
                        <div className="mt-4 flex flex-col gap-2 text-sm text-slate-200">
                            <button
                                type="button"
                                onClick={() => onNavigate("product")}
                                className="text-left transition hover:text-white"
                            >
                                Product preview
                            </button>
                            <button
                                type="button"
                                onClick={() => onNavigate("flow")}
                                className="text-left transition hover:text-white"
                            >
                                Learning flow
                            </button>
                            <button
                                type="button"
                                onClick={() => onNavigate("rewards")}
                                className="text-left transition hover:text-white"
                            >
                                Rewards
                            </button>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                            Truy cập
                        </p>
                        <div className="mt-4 flex flex-col gap-2 text-sm text-slate-200">
                            <button
                                type="button"
                                onClick={() => onNavigate("login")}
                                className="text-left transition hover:text-white"
                            >
                                Đăng nhập
                            </button>
                            <button
                                type="button"
                                onClick={() => onNavigate("register")}
                                className="text-left transition hover:text-white"
                            >
                                Tạo tài khoản
                            </button>
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

                <div className="relative mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <span>© {currentYear} LingoLoot. All rights reserved.</span>
                    <span>Thiết kế cho người học tiếng Anh.</span>
                </div>
            </div>
        </AnimatedSection>
    );
}
