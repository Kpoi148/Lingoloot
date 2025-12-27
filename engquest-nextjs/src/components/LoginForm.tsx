"use client";

import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginFormProps = {
  callbackUrl?: string;
};

export default function LoginForm({ callbackUrl }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const redirectUrl = callbackUrl ?? "/topics";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
      callbackUrl: redirectUrl,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Email hoặc mật khẩu không đúng.");
      return;
    }

    const session = await getSession();
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push(result.url ?? redirectUrl);
    }
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur sm:p-8 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-slate-900/10 blur-2xl animate-pulse" />

      <div className="mb-6 space-y-2">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Đăng nhập
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Đăng nhập
        </h1>
        <p className="text-sm text-slate-500">
          Chào mừng bạn quay lại. Hãy nhập thông tin tài khoản.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-slate-900/70 focus:ring-4 focus:ring-slate-900/10"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-slate-900/70 focus:ring-4 focus:ring-slate-900/10"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group mt-6 h-11 w-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="flex items-center justify-center gap-2">
      {loading ? "Đang xử lý..." : "Đăng nhập"}
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 transition group-hover:scale-110" />
        </span>
      </button>
    </form>
  );
}
