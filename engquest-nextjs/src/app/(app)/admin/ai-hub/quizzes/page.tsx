"use client";

import QuizBuilder from "@/components/ai-hub/QuizBuilder";

export const dynamic = "force-static";

export default function AdminQuizBuilderPage() {
  return (
    <div className="space-y-6">
      <QuizBuilder />
    </div>
  );
}
