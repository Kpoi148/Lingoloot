"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Sparkles } from "lucide-react";

export default function AdminTopbarActions() {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/admin/ai-hub"
        className="inline-flex items-center gap-2 rounded-full border border-pink-200/70 bg-white px-4 py-2 text-sm font-semibold text-transparent shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(236,72,153,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/60"
      >
        <Sparkles className="h-4 w-4 text-pink-500" />
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          AI Studio
        </span>
      </Link>
      <Link
        href="/admin"
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        Về trang chủ
      </Link>
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: "/" })}
        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        Đăng xuất
      </button>
    </div>
  );
}
