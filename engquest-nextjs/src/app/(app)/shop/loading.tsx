import { Skeleton } from "@/components/ui/Skeleton";
import { ShoppingBag } from "lucide-react";

export default function Loading() {
    return (
        <main className="min-h-screen bg-slate-50/70 py-10 px-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-3xl font-bold">
                            <ShoppingBag className="h-8 w-8 text-slate-300" />
                            <div className="h-8 w-40 bg-slate-200 rounded-lg dark:bg-slate-800 animate-pulse" />
                        </h1>
                        <div className="mt-2 h-4 w-60 bg-slate-200 rounded-lg dark:bg-slate-800 animate-pulse" />
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Tabs Skeleton */}
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32 rounded-xl" />
                        <Skeleton className="h-10 w-32 rounded-xl" />
                    </div>

                    {/* Grid Skeleton */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <Skeleton className="self-start h-5 w-16 rounded-full" />
                                <Skeleton className="aspect-square w-full rounded-xl" />
                                <Skeleton className="h-6 w-3/4 rounded-lg" />
                                <Skeleton className="h-4 w-1/2 rounded-lg" />
                                <Skeleton className="mt-auto h-10 w-full rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
