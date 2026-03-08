"use client";
// Admin AI tool for generating vocabulary sets and quiz-ready word data.

import InputPanel from "@/components/admin/ai-hub/vocabulary-generator/InputPanel";
import PreviewPanel from "@/components/admin/ai-hub/vocabulary-generator/PreviewPanel";
import { useVocabularyGeneratorController } from "@/components/admin/ai-hub/vocabulary-generator/useVocabularyGeneratorController";

export default function VocabularyGenerator() {
  const {
    categories,
    categoryId,
    handleGenerate,
    handleSave,
    hasQuizData,
    hasWordItems,
    isLoading,
    isSaving,
    level,
    prompt,
    quizData,
    resultData,
    setCategoryId,
    setLevel,
    setPrompt,
    wordItems,
  } = useVocabularyGeneratorController();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        <InputPanel
          categories={categories}
          categoryId={categoryId}
          isLoading={isLoading}
          level={level}
          prompt={prompt}
          onCategoryChange={setCategoryId}
          onGenerate={handleGenerate}
          onLevelChange={setLevel}
          onPromptChange={setPrompt}
        />

        <PreviewPanel
          hasQuizData={hasQuizData}
          hasWordItems={hasWordItems}
          isLoading={isLoading}
          isSaving={isSaving}
          prompt={prompt}
          quizData={quizData}
          resultData={resultData}
          wordItems={wordItems}
          onGenerate={handleGenerate}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
