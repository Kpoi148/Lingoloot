"use client";
// Admin AI builder for generating, reviewing, and exporting quiz drafts.

import ConfigPanel from "@/components/admin/ai-hub/quiz-builder/ConfigPanel";
import PreviewPanel from "@/components/admin/ai-hub/quiz-builder/PreviewPanel";
import { useQuizBuilderController } from "@/components/admin/ai-hub/quiz-builder/useQuizBuilderController";

export default function QuizBuilder() {
  const {
    categories,
    customPrompt,
    editableQuiz,
    filteredVocabularies,
    handleDiscard,
    handleExplanationChange,
    handleGenerate,
    handleOptionChange,
    handleQuestionChange,
    handleSave,
    handleTitleChange,
    handleToggleWord,
    isLoading,
    isSaving,
    level,
    questionCount,
    quizResult,
    selectedWordIds,
    setCustomPrompt,
    setLevel,
    setQuestionCount,
    setSelectedWordIds,
    setTopic,
    setVocabSearch,
    topic,
    vocabSearch,
  } = useQuizBuilderController();

  return (
    <div className="grid items-start gap-6 lg:grid-cols-12">
      <ConfigPanel
        categories={categories}
        customPrompt={customPrompt}
        filteredVocabularies={filteredVocabularies}
        isLoading={isLoading}
        level={level}
        questionCount={questionCount}
        selectedWordIds={selectedWordIds}
        topic={topic}
        vocabSearch={vocabSearch}
        onCustomPromptChange={setCustomPrompt}
        onGenerate={handleGenerate}
        onLevelChange={setLevel}
        onQuestionCountChange={setQuestionCount}
        onSelectAll={() =>
          setSelectedWordIds(filteredVocabularies.map((item) => item._id))
        }
        onTopicChange={setTopic}
        onToggleWord={handleToggleWord}
        onVocabSearchChange={setVocabSearch}
        onClearSelection={() => setSelectedWordIds([])}
      />

      <PreviewPanel
        editableQuiz={editableQuiz}
        isSaving={isSaving}
        quizResult={quizResult}
        onDiscard={handleDiscard}
        onExplanationChange={handleExplanationChange}
        onOptionChange={handleOptionChange}
        onQuestionChange={handleQuestionChange}
        onSave={handleSave}
        onTitleChange={handleTitleChange}
      />
    </div>
  );
}
