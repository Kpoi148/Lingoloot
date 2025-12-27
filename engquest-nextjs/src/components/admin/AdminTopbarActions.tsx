"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminTopbarActions() {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/"
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
