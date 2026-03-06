"use client";

import BuilderConfigCard from "@/components/admin/ai-hub/game-builder/BuilderConfigCard";
import JsonOutputCard from "@/components/admin/ai-hub/game-builder/JsonOutputCard";
import PreviewCard from "@/components/admin/ai-hub/game-builder/PreviewCard";
import { useGameBuilderController } from "@/components/admin/ai-hub/game-builder/useGameBuilderController";

export default function GameBuilder() {
    const {
        answerSet,
        categories,
        dataError,
        difficulty,
        filteredVocabularies,
        game,
        generateError,
        generating,
        handleGenerate,
        handleJsonChange,
        handleSave,
        isSaving,
        jsonError,
        loadMeaning,
        previewWordBank,
        rawJson,
        saveState,
        sanitizedVocabulary,
        selectedMeaning,
        selectedWordIds,
        setDifficulty,
        setSelectedWordIds,
        setTopic,
        setVocabSearch,
        topic,
        topicVocabularies,
        vocabSearch,
    } = useGameBuilderController();

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    Game Management System
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Generate story cloze games with AI, edit the JSON, and preview before
                    publishing.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)]">
                <section className="space-y-6">
                    <BuilderConfigCard
                        categories={categories}
                        topic={topic}
                        setTopic={setTopic}
                        difficulty={difficulty}
                        setDifficulty={setDifficulty}
                        topicVocabularies={topicVocabularies}
                        sanitizedVocabularyCount={sanitizedVocabulary.length}
                        vocabSearch={vocabSearch}
                        setVocabSearch={setVocabSearch}
                        selectedWordIds={selectedWordIds}
                        setSelectedWordIds={setSelectedWordIds}
                        filteredVocabularies={filteredVocabularies}
                        dataError={dataError}
                        generateError={generateError}
                        generating={generating}
                        onGenerate={handleGenerate}
                    />

                    <JsonOutputCard
                        rawJson={rawJson}
                        onJsonChange={handleJsonChange}
                        onSave={handleSave}
                        isSaving={isSaving}
                        jsonError={jsonError}
                        saveState={saveState}
                    />
                </section>

                <section className="space-y-6">
                    <PreviewCard
                        game={game}
                        answerSet={answerSet}
                        previewWordBank={previewWordBank}
                        selectedMeaning={selectedMeaning}
                        onWordClick={(word) => {
                            void loadMeaning(word);
                        }}
                    />
                </section>
            </div>
        </div>
    );
}
