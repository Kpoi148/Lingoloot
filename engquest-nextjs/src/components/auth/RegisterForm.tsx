"use client";
// Registration form for creating a new learner account.

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
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      {/* 2-column grid on sm+, 1-column on mobile */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Họ và tên
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            name="name"
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:focus:border-amber-400 dark:focus:bg-slate-950"
            placeholder="Nguyễn Văn A"
          />
        </div>

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
          <label htmlFor="password" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            name="password"
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:focus:border-amber-400 dark:focus:bg-slate-950"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className="text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            Nhập lại mật khẩu
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            name="confirmPassword"
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:focus:border-amber-400 dark:focus:bg-slate-950"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-800/80 dark:bg-red-950/60 dark:text-red-300">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/50 dark:text-emerald-300">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 h-10.5 w-full rounded-xl bg-slate-950 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
      >
        {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản ngay"}
      </button>
    </form>
  );
}
