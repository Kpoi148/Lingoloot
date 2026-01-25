"use client";

type OverviewData = {
    vocabularyCount: number;
    categoryCount: number;
    quizCount: number;
    userCount: number;
};

type AdminDashboardClientProps = {
    // profile: UserProfile | null; // Removed profile prop
    overviewData: OverviewData | null;
    // shopItems?: any[]; // Removed shopItems prop
    error?: string | null;
};

export default function AdminDashboardClient({
    overviewData,
    error,
}: AdminDashboardClientProps) {
    const stats = [
        { label: "Từ vựng", value: overviewData?.vocabularyCount },
        { label: "Chủ đề", value: overviewData?.categoryCount },
        { label: "Quiz", value: overviewData?.quizCount },
        { label: "Người dùng", value: overviewData?.userCount },
    ];

    return (
        <div className="space-y-8">
            {/* Profile Card Removed */}

            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Thống kê hệ thống</h2>
                    <p className="text-sm text-slate-500">Tổng quan về nội dung và người dùng.</p>
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
                            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                        >
                            <div className="relative z-10">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                    {item.label}
                                </p>
                                <p className="mt-3 text-3xl font-semibold text-slate-900">
                                    {typeof item.value === "number" ? item.value : "--"}
                                </p>
                            </div>
                            {/* Decorative background element */}
                            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-slate-50 transition-transform group-hover:scale-110" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
