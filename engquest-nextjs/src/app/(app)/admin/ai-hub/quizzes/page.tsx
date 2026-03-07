"use client";
// Admin AI page for generating quiz drafts.

import QuizBuilder from "@/components/admin/ai-hub/QuizBuilder";

export const dynamic = "force-static";

export default function AdminQuizBuilderPage() {
  return (
    <div className="space-y-6">
      <QuizBuilder />
    </div>
  );
}
