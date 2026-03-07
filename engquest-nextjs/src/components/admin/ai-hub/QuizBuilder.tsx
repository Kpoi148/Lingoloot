"use client";
// Admin AI builder for generating, reviewing, and exporting quiz drafts.

import { useEffect, useMemo, useState } from "react";
import { Loader2, Save, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import {
    generateQuizWithAi,
    loadQuizBuilderData,
    saveGeneratedQuiz,
} from "@/components/admin/ai-hub/quiz-builder/api";
import {
    defaultPrompt,
    levels,
    presets,
    type CategoryOption,
    type EditableQuiz,
    type VocabularyItem,
} from "@/components/admin/ai-hub/quiz-builder/types";
import {
    filterVocabulariesByKeyword,
    getTopicVocabularies,
    normalizeQuizResult,
    selectVocabulariesByIds,
} from "@/components/admin/ai-hub/quiz-builder/utils";

export default function QuizBuilder() {
    const [customPrompt, setCustomPrompt] = useState(defaultPrompt);
    const [level, setLevel] =
        useState<(typeof levels)[number]>("Trung bình");
    const [topic, setTopic] = useState("");
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [vocabularies, setVocabularies] = useState<VocabularyItem[]>([]);
    const [vocabSearch, setVocabSearch] = useState("");
    const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
    const [quizResult, setQuizResult] = useState<object | null>(null);
    const [editableQuiz, setEditableQuiz] = useState<EditableQuiz | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [questionCount, setQuestionCount] = useState(10);

    useEffect(() => {
        let active = true;

        // This function loads categories and vocabulary once so the quiz builder can filter locally afterward.
        const loadData = async () => {
            try {
                const data = await loadQuizBuilderData();
                if (active) {
                    const nextCategories = data.categories;
                    setCategories(nextCategories);
                    setTopic((prev) => prev || nextCategories[0]?.slug || "");
                    setVocabularies(data.vocabularies);
                }
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : "Không thể tải dữ liệu."
                );
            }
        };

        loadData();

        return () => {
            active = false;
        };
    }, []);

    const topicVocabularies = useMemo(
        () => getTopicVocabularies(topic, categories, vocabularies),
        [categories, topic, vocabularies]
    );

    const filteredVocabularies = useMemo(
        () => filterVocabulariesByKeyword(vocabSearch, topicVocabularies),
        [topicVocabularies, vocabSearch]
    );

    const selectedWords = useMemo(
        () => selectVocabulariesByIds(selectedWordIds, vocabularies),
        [selectedWordIds, vocabularies]
    );

    useEffect(() => {
        setSelectedWordIds([]);
        setVocabSearch("");
    }, [topic]);

    const normalizedQuiz = useMemo(() => normalizeQuizResult(quizResult), [quizResult]);

    useEffect(() => {
        setEditableQuiz(normalizedQuiz);
    }, [normalizedQuiz]);

    // This function generates a quiz from either the selected words or the full topic vocabulary.
    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast.error("Vui lòng chọn chủ đề trước khi tạo quiz.");
            return;
        }

        const topicWords =
            selectedWordIds.length > 0 ? selectedWords : topicVocabularies;

        if (topicWords.length === 0) {
            toast.error("Chủ đề này chưa có từ vựng để tạo quiz.");
            return;
        }

        setIsLoading(true);
        try {
            const topicName =
                categories.find((item) => item.slug === topic)?.name ?? topic;
            const quizData = await generateQuizWithAi({
                topicName,
                customPrompt,
                questionCount,
                topicWords,
            });
            setQuizResult(quizData);
            setEditableQuiz(null);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Không thể tạo quiz."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // This function updates the editable quiz title without mutating the raw AI payload.
    const handleTitleChange = (value: string) => {
        setEditableQuiz((prev) => (prev ? { ...prev, title: value } : prev));
    };

    const handleQuestionChange = (id: string, value: string) => {
        setEditableQuiz((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                questions: prev.questions.map((question) =>
                    question.id === id ? { ...question, question: value } : question
                ),
            };
        });
    };

    const handleOptionChange = (
        id: string,
        optionIndex: number,
        value: string
    ) => {
        setEditableQuiz((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                questions: prev.questions.map((question) => {
                    if (question.id !== id) return question;
                    const nextOptions = [...question.options];
                    nextOptions[optionIndex] = value;
                    return { ...question, options: nextOptions };
                }),
            };
        });
    };

    const handleExplanationChange = (id: string, value: string) => {
        setEditableQuiz((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                questions: prev.questions.map((question) =>
                    question.id === id ? { ...question, explanation: value } : question
                ),
            };
        });
    };

    // This function clears both the raw result and editable state so the preview resets completely.
    const handleDiscard = () => {
        setQuizResult(null);
        setEditableQuiz(null);
    };

    // This function saves only the normalized editable quiz so invalid AI output never reaches storage.
    const handleSave = async () => {
        if (!editableQuiz || editableQuiz.questions.length === 0) {
            toast.error("Chưa có dữ liệu quiz để lưu.");
            return;
        }

        if (!topic.trim()) {
            toast.error("Vui lòng chọn chủ đề để liên kết quiz.");
            return;
        }

        const categorySlug =
            categories.find((item) => item.slug === topic)?.slug ?? topic;

        if (!categorySlug) {
            toast.error("Chủ đề không hợp lệ.");
            return;
        }

        setIsSaving(true);
        try {
            await saveGeneratedQuiz({ editableQuiz, categorySlug, level });
            toast.success("Đã lưu quiz vào cơ sở dữ liệu.");
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Không thể lưu quiz."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // This function toggles a vocabulary item in the local selection set for the next generation run.
    const handleToggleWord = (id: string) => {
        setSelectedWordIds((prev) =>
            prev.includes(id) ? prev.filter((wordId) => wordId !== id) : [...prev, id]
        );
    };

    return (
        <div className="grid items-start gap-6 lg:grid-cols-12">
            <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20 lg:col-span-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                        Configuration Panel
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        Quiz Builder
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Configure data source and AI instructions before generating a quiz.
                    </p>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        Select Topic
                    </label>
                    <select
                        value={topic}
                        onChange={(event) => setTopic(event.target.value)}
                        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    >
                        <option value="">Chọn chủ đề</option>
                        {categories.map((item) => (
                            <option key={item._id} value={item.slug}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-500">
                        Chọn chủ đề để lấy từ vựng. Không chọn từ cụ thể sẽ dùng toàn bộ từ
                        của chủ đề.
                    </p>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        Vocabulary Source (Optional)
                    </label>
                    <input
                        value={vocabSearch}
                        onChange={(event) => setVocabSearch(event.target.value)}
                        placeholder="Tìm theo từ vựng..."
                        className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    />
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Đã chọn {selectedWordIds.length} từ.</span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedWordIds(
                                        filteredVocabularies.map((item) => item._id)
                                    )
                                }
                                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                                Chọn tất cả
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedWordIds([])}
                                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                                Bỏ chọn
                            </button>
                        </div>
                    </div>

                    <div className="max-h-56 space-y-2 overflow-auto rounded-2xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
                        {!topic && (
                            <p className="text-xs text-slate-400">
                                Hãy chọn chủ đề để hiển thị danh sách từ.
                            </p>
                        )}
                        {topic && filteredVocabularies.length === 0 && (
                            <p className="text-xs text-slate-400">
                                Chủ đề này chưa có từ vựng phù hợp.
                            </p>
                        )}
                        {topic &&
                            filteredVocabularies.map((item) => {
                                const isSelected = selectedWordIds.includes(item._id);
                                return (
                                    <label
                                        key={item._id}
                                        className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2 transition ${isSelected
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400"
                                            : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                            }`}
                                    >
                                        <div>
                                            <p className="font-semibold text-slate-700 dark:text-slate-200">
                                                {item.word}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {item.meaning}
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleToggleWord(item._id)}
                                            className="h-4 w-4"
                                        />
                                    </label>
                                );
                            })}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Custom Prompt Configuration
                    </label>
                    <textarea
                        value={customPrompt}
                        onChange={(event) => setCustomPrompt(event.target.value)}
                        className="min-h-[200px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    />
                    <div className="flex flex-wrap gap-2">
                        {presets.map((preset) => (
                            <button
                                key={preset.label}
                                type="button"
                                onClick={() => setCustomPrompt(preset.value)}
                                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Số câu hỏi
                    </label>
                    <input
                        type="number"
                        min={1}
                        max={50}
                        value={questionCount}
                        onChange={(event) =>
                            setQuestionCount(Number.parseInt(event.target.value, 10) || 1)
                        }
                        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    />
                    <p className="text-xs text-slate-500">
                        Tối đa 50 câu để đảm bảo chất lượng.
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Mức độ
                    </label>
                    <select
                        value={level}
                        onChange={(event) =>
                            setLevel(event.target.value as (typeof levels)[number])
                        }
                        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    >
                        {levels.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Generate Quiz
                </button>
            </section >

            <section className="flex min-h-[calc(100vh-220px)] flex-col gap-4 overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20 lg:col-span-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quiz Preview</h2>
                {!quizResult ? (
                    <div className="flex min-h-[320px] flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-400 shadow-sm">
                            <Sparkles className="h-10 w-10" />
                        </div>
                        <p className="text-center text-sm text-slate-500">
                            Configure instructions on the left to generate quiz.
                        </p>
                    </div>
                ) : (
                    <div className="flex min-h-0 flex-1 flex-col gap-4">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    Quiz Title
                                </label>
                                <input
                                    value={editableQuiz?.title ?? ""}
                                    onChange={(event) => handleTitleChange(event.target.value)}
                                    placeholder="Quiz title"
                                    className="h-11 w-full min-w-[220px] rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                />
                            </div>
                            <div className="flex flex-wrap items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    <Save className="h-4 w-4" />
                                    {isSaving ? "Đang lưu..." : "Save to Database"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDiscard}
                                    className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    Discard
                                </button>
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
                            {(editableQuiz?.questions ?? []).map((question, index) => (
                                <div
                                    key={question.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                            Câu hỏi {index + 1}
                                        </label>
                                        <input
                                            value={question.question}
                                            onChange={(event) =>
                                                handleQuestionChange(question.id, event.target.value)
                                            }
                                            className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                        />
                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {question.options.map((option, optionIndex) => {
                                            const isCorrect = optionIndex === question.correctIndex;
                                            return (
                                                <input
                                                    key={`${question.id}-${optionIndex}`}
                                                    value={option}
                                                    onChange={(event) =>
                                                        handleOptionChange(
                                                            question.id,
                                                            optionIndex,
                                                            event.target.value
                                                        )
                                                    }
                                                    className={`h-11 w-full rounded-2xl border px-4 text-sm shadow-sm focus:border-slate-300 focus:outline-none ${isCorrect
                                                        ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                        : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                                        }`}
                                                />
                                            );
                                        })}
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                            Explanation
                                        </label>
                                        <textarea
                                            value={question.explanation}
                                            onChange={(event) =>
                                                handleExplanationChange(question.id, event.target.value)
                                            }
                                            className="min-h-[90px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                )}
            </section>
        </div >
    );
}
