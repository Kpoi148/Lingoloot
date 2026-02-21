"use client";

import Link from "next/link";
import { useState } from "react";

type ResetPasswordFormProps = {
  token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const hasValidToken = token.length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!hasValidToken) {
      setError("Lien ket khong hop le hoac da het han.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        setError(data.message ?? "Khong the dat lai mat khau.");
        setLoading(false);
        return;
      }

      setSuccess(data.message ?? "Dat lai mat khau thanh cong.");
      form.reset();
      setLoading(false);
    } catch (submitError) {
      setSuccess(null);
      setLoading(false);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Khong the dat lai mat khau."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-slate-950/40 sm:p-8"
    >
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Dat lai mat khau
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Nhap mat khau moi. Lien ket reset chi hieu luc trong 15 phut va chi
          dung duoc mot lan.
        </p>
      </div>

      {!hasValidToken && (
        <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-800/80 dark:bg-red-950/60 dark:text-red-300">
          Lien ket reset khong hop le hoac da het han.
        </p>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Mat khau moi
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            name="password"
            placeholder="••••••••"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-slate-900/70 focus:ring-4 focus:ring-slate-900/10 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-slate-400 dark:focus:ring-slate-500/20"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Xac nhan mat khau moi
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            name="confirmPassword"
            placeholder="••••••••"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-slate-900/70 focus:ring-4 focus:ring-slate-900/10 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-slate-400 dark:focus:ring-slate-500/20"
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
        disabled={loading || !hasValidToken}
        className="mt-6 h-11 w-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 dark:text-slate-900 dark:shadow-slate-950/40"
      >
        {loading ? "Dang cap nhat..." : "Cap nhat mat khau"}
      </button>

      <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link
          href="/"
          className="font-medium text-slate-700 underline-offset-2 hover:underline dark:text-slate-200"
        >
          Quay lai dang nhap
        </Link>
      </p>
    </form>
  );
}
