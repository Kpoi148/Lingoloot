"use client";

// Controller hook that manages AI vocabulary generation and save-to-database flow.
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  generateVocabularyContent,
  loadVocabularyCategories,
  saveVocabularyWord,
} from "@/components/admin/ai-hub/vocabulary-generator/api";
import {
  vocabularyLevels,
  type CategoryOption,
  type QuizResult,
  type WordResult,
} from "@/components/admin/ai-hub/vocabulary-generator/types";
import {
  getQuizData,
  getRequestedCount,
  getWordItems,
} from "@/components/admin/ai-hub/vocabulary-generator/utils";

export function useVocabularyGeneratorController() {
  const [prompt, setPrompt] = useState("");
  const [level, setLevel] = useState<(typeof vocabularyLevels)[number]>(
    "Cơ bản"
  );
  const [resultData, setResultData] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      setCategoriesError(null);
      try {
        const items = await loadVocabularyCategories();
        if (!active) return;

        setCategories(items);
        if (items.length === 1) {
          setCategoryId(items[0]._id);
        }
      } catch (error) {
        if (active) {
          setCategories([]);
          setCategoryId("");
          setCategoriesError(
            error instanceof Error
              ? error.message
              : "Không thể tải danh sách chủ đề."
          );
        }
      }
    };

    void loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const wordItems = useMemo(() => getWordItems(resultData), [resultData]);
  const quizData = useMemo(() => getQuizData(resultData), [resultData]);
  const hasWordItems = Boolean(wordItems?.length);
  const hasQuizData = Boolean(quizData);

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast.error("Vui lòng nhập từ khóa hoặc chủ đề.");
      return;
    }

    const requestedCount = getRequestedCount(trimmedPrompt);
    const loadingToast = toast.loading("Đang tạo nội dung...");
    setIsLoading(true);

    try {
      const nextData = await generateVocabularyContent({
        prompt: trimmedPrompt,
        level,
        requestedCount,
      });
      setResultData(nextData);
      toast.success("Đã tạo nội dung.", { id: loadingToast });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tạo nội dung.",
        { id: loadingToast }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!wordItems || wordItems.length === 0) {
      toast.error("Không có dữ liệu từ vựng để lưu.");
      return;
    }

    if (!categoryId) {
      toast.error("Vui lòng chọn chủ đề để lưu vào hệ thống.");
      return;
    }

    const savingToast = toast.loading("Đang lưu dữ liệu...");
    setIsSaving(true);

    try {
      for (const item of wordItems) {
        if (!item.word || !item.meaning) {
          throw new Error("Dữ liệu từ vựng chưa đầy đủ để lưu.");
        }

        await saveVocabularyWord(item, categoryId);
      }

      toast.success("Đã lưu vào cơ sở dữ liệu.", { id: savingToast });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Lưu dữ liệu thất bại.",
        { id: savingToast }
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    categories,
    categoriesError,
    categoryId,
    handleGenerate,
    handleSave,
    hasQuizData,
    hasWordItems,
    isLoading,
    isSaving,
    level,
    prompt,
    quizData: quizData as QuizResult | null,
    resultData,
    setCategoryId,
    setLevel,
    setPrompt,
    wordItems: wordItems as WordResult[] | null,
  };
}
