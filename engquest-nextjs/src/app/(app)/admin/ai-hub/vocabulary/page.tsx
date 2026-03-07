"use client";
// Admin AI page for generating vocabulary sets and related practice data.

import VocabularyGenerator from "@/components/admin/ai-hub/VocabularyGenerator";

export const dynamic = "force-static";

export default function AdminAIVocabularyPage() {
  return (
    <div className="space-y-6">
      <VocabularyGenerator />
    </div>
  );
}
