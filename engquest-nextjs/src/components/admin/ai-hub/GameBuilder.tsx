"use client";

import dynamicImport from "next/dynamic";
import { useActionState, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Save, Sparkles } from "lucide-react";

const MonacoEditor = dynamicImport(() => import("@monaco-editor/react"), {
    ssr: false,
    loading: () => (
        <div className="h-[360px] w-full animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
    ),
});

type CategoryOption = {
    _id: string;
    name: string;
    slug: string;
};

type VocabularyItem = {
    _id: string;
    word: string;
    meaning: string;
    category_id?: string;
    category?: {
        name?: string;
        slug?: string;
    };
};

type Difficulty = "easy" | "medium" | "hard";

type ContentItem = {
    text: string;
    type: "text" | "gap";
    answer?: string;
};

type Game = {
    title: string;
    content: ContentItem[];
    distractors: string[];
};

type SaveState = {
    status: "idle" | "success" | "error";
    message: string;
};

const ContentItemSchema = z
    .object({
        text: z.string(),
        type: z.enum(["text", "gap"]),
        answer: z.string().optional(),
    })
    .superRefine((value, ctx) => {
        if (value.type === "gap" && !value.answer) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "answer is required when type is 'gap'",
            });
        }
    });

const GameSchema = z.object({
    title: z.string(),
    content: z.array(ContentItemSchema),
    distractors: z.array(z.string()),
});

const formatIssues = (issues: z.ZodIssue[]) =>
    issues.map((issue) => issue.message).join(" | ");

export default function GameBuilder() {
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [vocabularies, setVocabularies] = useState<VocabularyItem[]>([]);
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState<Difficulty>("medium");
    const [vocabSearch, setVocabSearch] = useState("");
    const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
    const [dataError, setDataError] = useState<string | null>(null);
    const [rawJson, setRawJson] = useState("");
    const [game, setGame] = useState<Game | null>(null);
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [generateError, setGenerateError] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [meaningCache, setMeaningCache] = useState<Record<string, string>>({});
    const [selectedMeaning, setSelectedMeaning] = useState<{
        word: string;
        meaning: string;
    } | null>(null);

    const [saveState, saveAction, isSaving] = useActionState<
        SaveState,
        { game: Game | null; topicName: string }
    >(async (_prevState, payload) => {
        if (!payload.topicName.trim()) {
            return {
                status: "error",
                message: "Topic name is required before saving.",
            };
        }
        if (!payload.game) {
            return {
                status: "error",
                message: "Game JSON is invalid or empty.",
            };
        }

        try {
            const response = await fetch("/api/admin/games", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...payload.game,
                    topicName: payload.topicName.trim(),
                    status: "active",
                }),
            });

            let payloadBody: { message?: string } | null = null;
            try {
                payloadBody = (await response.json()) as { message?: string };
            } catch {
                payloadBody = null;
            }

            if (!response.ok) {
                throw new Error(payloadBody?.message ?? "Unable to save game.");
            }

            return {
                status: "success",
                message: "Game saved with status active.",
            };
        } catch (error) {
            return {
                status: "error",
                message:
                    error instanceof Error ? error.message : "Unable to save game.",
            };
        }
    }, {
        status: "idle",
        message: "",
    });

    useEffect(() => {
        let active = true;

        const loadData = async () => {
            setDataError(null);
            try {
                const [categoryRes, vocabRes] = await Promise.all([
                    fetch("/api/admin/categories", { cache: "no-store" }),
                    fetch("/api/admin/vocabularies", { cache: "no-store" }),
                ]);

                const categoryPayload = (await categoryRes.json()) as {
                    data?: CategoryOption[];
                    message?: string;
                };
                const vocabPayload = (await vocabRes.json()) as {
                    data?: VocabularyItem[];
                    message?: string;
                };

                if (!categoryRes.ok) {
                    throw new Error(
                        categoryPayload.message ?? "Unable to load categories."
                    );
                }

                if (!vocabRes.ok) {
                    throw new Error(
                        vocabPayload.message ?? "Unable to load vocabularies."
                    );
                }

                if (active) {
                    const nextCategories = categoryPayload.data ?? [];
                    setCategories(nextCategories);
                    setTopic((prev) => prev || nextCategories[0]?.slug || "");
                    setVocabularies(vocabPayload.data ?? []);
                }
            } catch (error) {
                if (active) {
                    setDataError(
                        error instanceof Error ? error.message : "Unable to load data."
                    );
                }
            }
        };

        loadData();

        return () => {
            active = false;
        };
    }, []);

    const selectedCategory = useMemo(
        () => categories.find((item) => item.slug === topic),
        [categories, topic]
    );

    const topicVocabularies = useMemo(() => {
        if (!topic.trim()) return [];
        const topicSlug = topic.trim();
        const topicId = selectedCategory?._id;
        return vocabularies.filter(
            (item) =>
                item.category?.slug === topicSlug ||
                (topicId ? item.category_id === topicId : false)
        );
    }, [topic, selectedCategory, vocabularies]);

    const filteredVocabularies = useMemo(() => {
        const needle = vocabSearch.trim().toLowerCase();
        if (!needle) return topicVocabularies;
        return topicVocabularies.filter((item) =>
            item.word.toLowerCase().includes(needle)
        );
    }, [vocabSearch, topicVocabularies]);

    const selectedWords = useMemo(() => {
        const selected = new Set(selectedWordIds);
        return vocabularies.filter((item) => selected.has(item._id));
    }, [selectedWordIds, vocabularies]);

    const sanitizedVocabulary = useMemo(() => {
        const source =
            selectedWordIds.length > 0 ? selectedWords : topicVocabularies;
        return source
            .map((item) => ({
                word: item.word.trim(),
                meaning: item.meaning.trim(),
            }))
            .filter((item) => item.word && item.meaning);
    }, [selectedWordIds, selectedWords, topicVocabularies]);

    useEffect(() => {
        setSelectedWordIds([]);
        setVocabSearch("");
    }, [topic]);

    const previewWordBank = useMemo(() => {
        if (!game) return [];
        const answers = game.content
            .map((item) =>
                item.type === "gap" ? item.answer ?? item.text ?? "" : ""
            )
            .filter(Boolean);
        return [...answers, ...game.distractors];
    }, [game]);

    const answerSet = useMemo(() => {
        const set = new Set<string>();
        if (!game) return set;
        game.content.forEach((item) => {
            if (item.type === "gap") {
                const answer = item.answer ?? item.text ?? "";
                if (answer) {
                    set.add(answer.toLowerCase());
                }
            }
        });
        return set;
    }, [game]);

    const loadMeaning = async (word: string) => {
        const normalized = word.toLowerCase();
        if (meaningCache[normalized]) {
            setSelectedMeaning({ word, meaning: meaningCache[normalized] });
            return;
        }

        try {
            const response = await fetch(
                `/api/dictionary/meaning?word=${encodeURIComponent(word)}`,
                { cache: "no-store" }
            );
            const payload = (await response.json()) as {
                data?: { word?: string; meaning?: string };
                message?: string;
            };

            if (!response.ok) {
                throw new Error(payload.message ?? "Unable to fetch meaning.");
            }

            const meaning = payload.data?.meaning?.trim() ?? "";
            if (!meaning) {
                throw new Error("Meaning not found.");
            }

            setMeaningCache((prev) => ({ ...prev, [normalized]: meaning }));
            setSelectedMeaning({ word, meaning });
        } catch {
            // Ignore lookup errors in preview UI.
        }
    };

    const splitIntoTokens = (text: string) => {
        const tokens: Array<{ value: string; isWord: boolean }> = [];
        const pattern = /[A-Za-z]+(?:['-][A-Za-z]+)*/g;
        let lastIndex = 0;
        let match = pattern.exec(text);
        while (match) {
            if (match.index > lastIndex) {
                tokens.push({
                    value: text.slice(lastIndex, match.index),
                    isWord: false,
                });
            }
            tokens.push({ value: match[0], isWord: true });
            lastIndex = match.index + match[0].length;
            match = pattern.exec(text);
        }
        if (lastIndex < text.length) {
            tokens.push({ value: text.slice(lastIndex), isWord: false });
        }
        return tokens;
    };
    const parseJson = (value: string) => {
        if (!value.trim()) {
            setGame(null);
            setJsonError(null);
            return;
        }

        try {
            const parsed = JSON.parse(value) as unknown;
            const validated = GameSchema.safeParse(parsed);
            if (!validated.success) {
                setGame(null);
                setJsonError(formatIssues(validated.error.issues));
                return;
            }
            setGame(validated.data);
            setJsonError(null);
        } catch (error) {
            setGame(null);
            setJsonError(
                error instanceof Error ? error.message : "Invalid JSON format."
            );
        }
    };

    const handleJsonChange = (value?: string) => {
        const nextValue = value ?? "";
        setRawJson(nextValue);
        parseJson(nextValue);
    };

    const handleGenerate = async () => {
        setGenerateError(null);
        if (!topic.trim()) {
            setGenerateError("Please select a topic.");
            return;
        }
        if (sanitizedVocabulary.length === 0) {
            setGenerateError("No vocabulary available for the selected topic.");
            return;
        }

        setGenerating(true);
        try {
            const response = await fetch("/api/admin/games/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topicName: selectedCategory?.name ?? topic.trim(),
                    difficulty,
                    vocabularyList: sanitizedVocabulary,
                }),
            });

            const payload = (await response.json()) as { message?: string; data?: Game };

            if (!response.ok) {
                throw new Error(payload.message ?? "Unable to generate game.");
            }

            const gamePayload = payload.data ?? (payload as unknown as Game);
            const validated = GameSchema.safeParse(gamePayload);
            if (!validated.success) {
                throw new Error(formatIssues(validated.error.issues));
            }

            const formatted = JSON.stringify(validated.data, null, 2);
            setRawJson(formatted);
            setGame(validated.data);
            setJsonError(null);
        } catch (error) {
            setGenerateError(
                error instanceof Error ? error.message : "Unable to generate game."
            );
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = () => {
        void saveAction({ game, topicName: selectedCategory?.name ?? topic.trim() });
    };

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
                    <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                                    Editor
                                </p>
                                <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    Topic + Vocabulary
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={generating}
                                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <Sparkles className="h-4 w-4" />
                                {generating ? "Generating..." : "Generate with AI"}
                            </button>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                    Topic
                                </label>
                                <select
                                    value={topic}
                                    onChange={(event) => setTopic(event.target.value)}
                                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                >
                                    <option value="">Select a topic</option>
                                    {categories.map((item) => (
                                        <option key={item._id} value={item.slug}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    Vocabulary Count
                                </label>
                                <div className="flex h-11 items-center justify-between rounded-2xl border border-slate-200 px-4 text-sm text-slate-600">
                                    <span>{topicVocabularies.length} items</span>
                                    <span className="text-xs text-slate-400">
                                        {sanitizedVocabulary.length} selected
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                    Difficulty
                                </label>
                                <select
                                    value={difficulty}
                                    onChange={(event) =>
                                        setDifficulty(event.target.value as Difficulty)
                                    }
                                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                    Vocabulary Source
                                </label>
                                <input
                                    value={vocabSearch}
                                    onChange={(event) => setVocabSearch(event.target.value)}
                                    className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                    placeholder="Search vocabulary..."
                                />
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>{selectedWordIds.length} selected</span>
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
                                            Select all
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedWordIds([])}
                                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {dataError && (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {dataError}
                                </div>
                            )}

                            <div className="max-h-64 space-y-2 overflow-auto rounded-2xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
                                {!topic && (
                                    <p className="text-xs text-slate-400">
                                        Select a topic to load vocabulary.
                                    </p>
                                )}
                                {topic && filteredVocabularies.length === 0 && (
                                    <p className="text-xs text-slate-400">
                                        No vocabulary found for this topic.
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
                                                    onChange={() =>
                                                        setSelectedWordIds((prev) =>
                                                            prev.includes(item._id)
                                                                ? prev.filter((wordId) => wordId !== item._id)
                                                                : [...prev, item._id]
                                                        )
                                                    }
                                                    className="h-4 w-4"
                                                />
                                            </label>
                                        );
                                    })}
                            </div>
                            <p className="text-xs text-slate-500">
                                If no vocabulary is selected, all words in the topic are used.
                            </p>
                        </div>

                        {generateError && (
                            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {generateError}
                            </div>
                        )}
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                                    JSON Output
                                </p>
                                <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    Raw Game Data
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <Save className="h-4 w-4" />
                                {isSaving ? "Saving..." : "Save to Database"}
                            </button>
                        </div>

                        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                            <MonacoEditor
                                height="360px"
                                language="json"
                                theme="vs-light"
                                value={rawJson}
                                onChange={handleJsonChange}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 13,
                                    scrollBeyondLastLine: false,
                                    wordWrap: "on",
                                }}
                            />
                        </div>

                        {jsonError && (
                            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                {jsonError}
                            </div>
                        )}
                        {saveState.status !== "idle" && saveState.message && (
                            <div
                                className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${saveState.status === "success"
                                    ? "bg-emerald-500 text-white"
                                    : "bg-red-500 text-white"
                                    }`}
                            >
                                {saveState.message}
                            </div>
                        )}
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                            Live Preview
                        </p>
                        <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Student View
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            The preview updates when JSON is valid.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/20">
                        {!game && (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                Generate or paste valid JSON to preview the game.
                            </div>
                        )}

                        {game && (
                            <div className="space-y-5">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                                        Story Cloze
                                    </p>
                                    <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                                        {game.title}
                                    </h3>
                                </div>

                                <p className="text-base leading-7 text-slate-700 dark:text-slate-300">
                                    {game.content.map((item, index) => {
                                        if (item.type === "text") {
                                            return splitIntoTokens(item.text).map((token, tokenIndex) => {
                                                if (!token.isWord) {
                                                    return (
                                                        <span key={`${item.text}-${index}-${tokenIndex}`}>
                                                            {token.value}
                                                        </span>
                                                    );
                                                }
                                                const isAnswer = answerSet.has(token.value.toLowerCase());
                                                return (
                                                    <button
                                                        key={`${item.text}-${index}-${tokenIndex}`}
                                                        type="button"
                                                        onClick={() => {
                                                            if (!isAnswer) {
                                                                void loadMeaning(token.value);
                                                            }
                                                        }}
                                                        className={`mx-0.5 inline-flex items-center rounded-md px-1 text-sm font-semibold ${isAnswer
                                                            ? "cursor-default text-slate-400 dark:text-slate-500"
                                                            : "text-slate-700 underline decoration-dotted hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                                                            }`}
                                                    >
                                                        {token.value}
                                                    </button>
                                                );
                                            });
                                        }
                                        return (
                                            <span
                                                key={`${item.text}-${index}`}
                                                className="mx-1 inline-flex items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-2 py-0.5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                                            >
                                                {item.text || "___"}
                                            </span>
                                        );
                                    })}
                                </p>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                        Word Bank
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {previewWordBank.map((word, index) => (
                                            <span
                                                key={`${word}-${index}`}
                                                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                            >
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {selectedMeaning && (
                                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                        <span className="font-semibold">
                                            {selectedMeaning.word}:
                                        </span>{" "}
                                        {selectedMeaning.meaning}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
