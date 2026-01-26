"use client";

import VocabularyGenerator from "@/components/ai-hub/VocabularyGenerator";

export const dynamic = "force-static";

export default function AdminAIVocabularyPage() {
  return (
    <div className="space-y-6">
      <VocabularyGenerator />
    </div>
  );
}
