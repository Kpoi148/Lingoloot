import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { Manrope, Space_Grotesk } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export default function HomePage() {
  return (
    <main
      className={`${manrope.variable} ${spaceGrotesk.variable} relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-white to-sky-50 font-[var(--font-body)] text-slate-900`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 -left-28 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute left-1/2 top-16 h-20 w-20 -translate-x-1/2 rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-sm rotate-12" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-14 lg:flex-row lg:items-start">
        <section className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-sm">
            LingoLoot
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          </span>
          <div className="space-y-4">
            <h1 className="font-[var(--font-display)] text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Vốn từ vựng
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
              Nền tảng học tập tối giản giúp bạn{" "}
              <span className="font-semibold text-slate-900">
                tạo Flashcard tự động bằng AI
              </span>
              , luyện phát âm chuẩn IPA và{" "}
              <span className="font-semibold text-slate-900">
                ôn tập qua Quiz thông minh
              </span>
              .
            </p>
          </div>
          <div className="grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
                AI Automation
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                Tự động điền nghĩa, phiên âm IPA và ví dụ ngữ cảnh chuẩn xác chỉ với một từ khóa.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
                Smart Review
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                Hệ thống tự tạo bài Quiz trắc nghiệm đa dạng dựa trên chính danh sách từ vựng của bạn.
              </p>
            </div>
          </div>
        </section>

        <section className="flex w-full flex-1 flex-col gap-6">
          <LoginForm />
          <RegisterForm />
        </section>
      </div>
    </main>
  );
}
