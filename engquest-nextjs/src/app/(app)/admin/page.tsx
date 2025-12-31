"use client";

import { useEffect, useState } from "react";

type OverviewData = {
  vocabularyCount: number;
  categoryCount: number;
  quizCount: number;
  userCount: number;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const response = await fetch("/api/admin/overview", {
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          data?: OverviewData;
          message?: string;
        };

        if (!response.ok) {
          throw new Error(payload.message ?? "Unable to load overview data.");
        }

        if (active) {
          setData(payload.data ?? null);
        }
      } catch (fetchError) {
        if (active) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load overview data."
          );
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const stats = [
    { label: "Từ vựng", value: data?.vocabularyCount },
    { label: "Chủ đề", value: data?.categoryCount },
    { label: "Quiz", value: data?.quizCount },
    { label: "Người dùng", value: data?.userCount },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60">
        <h1 className="text-2xl font-semibold text-slate-900">
          Tổng quan hệ thống học tiếng Anh LingoLoot
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Chọn một mục trong menu để bắt đầu quản lý nội dung.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {item.label}
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {typeof item.value === "number" ? item.value : "--"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
