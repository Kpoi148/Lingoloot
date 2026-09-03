"use client";
// Credential login form used on the landing page and auth entry surfaces.

import Link from "next/link";
import { useState } from "react";

type LoginFormProps = {
  callbackUrl?: string;
};

export default function LoginForm({ callbackUrl }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const redirectUrl = callbackUrl ?? "/topics";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Email hoặc mật khẩu không đúng.");
      setLoading(false);
      return;
    }

    try {
      const { getSession, signIn } = await import("next-auth/react");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: redirectUrl,
      });

      if (!result || result.error) {
        setError("Email hoặc mật khẩu không đúng.");
        setLoading(false);
        return;
      }

      const session = await getSession();
      const role = (session?.user as { role?: string } | undefined)?.role;
      const targetUrl = role === "admin" ? "/admin" : result.url ?? redirectUrl;
      window.location.assign(targetUrl);
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : "Không thể đăng nhập."
      );
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3.5">
      <div className="space-y-1">
        <label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          name="email"
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:focus:border-amber-400 dark:focus:bg-slate-950"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Mật khẩu
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          name="password"
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:focus:border-amber-400 dark:focus:bg-slate-950"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-800/80 dark:bg-red-950/60 dark:text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 h-10.5 w-full rounded-xl bg-slate-950 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
      >
        {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
      </button>
    </form>
  );
}
