"use client";

// Controller hook that manages AI quiz generation, editing, and save actions.
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  generateQuizWithAi,
  loadQuizBuilderData,
  saveGeneratedQuiz,
} from "@/components/admin/ai-hub/quiz-builder/api";
import {
  defaultPrompt,
  levels,
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

export function useQuizBuilderController() {
  const [customPrompt, setCustomPrompt] = useState(defaultPrompt);
  const [level, setLevel] = useState<(typeof levels)[number]>("Trung bình");
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

    const loadData = async () => {
      try {
        const data = await loadQuizBuilderData();
        if (!active) return;

        const nextCategories = data.categories;
        setCategories(nextCategories);
        setTopic((prev) => prev || nextCategories[0]?.slug || "");
        setVocabularies(data.vocabularies);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Không thể tải dữ liệu."
        );
      }
    };

    void loadData();

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

  const normalizedQuiz = useMemo(
    () => normalizeQuizResult(quizResult),
    [quizResult]
  );

  useEffect(() => {
    setEditableQuiz(normalizedQuiz);
  }, [normalizedQuiz]);

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

  const handleDiscard = () => {
    setQuizResult(null);
    setEditableQuiz(null);
  };

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

  const handleToggleWord = (id: string) => {
    setSelectedWordIds((prev) =>
      prev.includes(id) ? prev.filter((wordId) => wordId !== id) : [...prev, id]
    );
  };

  return {
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
  };
}
