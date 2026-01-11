"use client";

import { useState } from "react";

type RegisterFormProps = {
  onSuccess?: () => void;
};

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!name || !email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message ?? "Đăng ký thất bại.");
        setLoading(false);
        return;
      }

      setSuccess(data.message ?? "User created successfully");
      form.reset();
      setLoading(false);
      onSuccess?.();
    } catch (fetchError) {
      setLoading(false);
      setError(
        fetchError instanceof Error ? fetchError.message : "Đăng ký thất bại."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-slate-950/40 sm:p-8"
    >
      <div className="pointer-events-none absolute -left-6 -top-10 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl animate-pulse dark:bg-emerald-500/20" />

      <div className="mb-6 space-y-2">
        <span className="inline-flex items-center rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          Tạo tài khoản
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Tạo tài khoản
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Bắt đầu với tài khoản mới của bạn.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Tên
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            name="name"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-emerald-400/80 focus:ring-4 focus:ring-emerald-200/70 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            name="email"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-emerald-400/80 focus:ring-4 focus:ring-emerald-200/70 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            name="password"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-emerald-400/80 focus:ring-4 focus:ring-emerald-200/70 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Nhập lại mật khẩu
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            name="confirmPassword"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-emerald-400/80 focus:ring-4 focus:ring-emerald-200/70 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-800/80 dark:bg-red-950/60 dark:text-red-300">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/50 dark:text-emerald-300">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group mt-6 h-11 w-full rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-500 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 dark:from-emerald-400 dark:via-emerald-400 dark:to-emerald-300 dark:text-slate-900 dark:shadow-emerald-500/20"
      >
        <span className="flex items-center justify-center gap-2">
          {loading ? "Đang xử lý..." : "Đăng ký"}
          <span className="h-1.5 w-1.5 rounded-full bg-white transition group-hover:scale-110 dark:bg-slate-900" />
        </span>
      </button>
    </form>
  );
}
