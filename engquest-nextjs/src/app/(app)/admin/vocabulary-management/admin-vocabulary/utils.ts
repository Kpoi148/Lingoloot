import type { VocabularyFilters, VocabularyItem } from "./types";

export const filterVocabularies = (
  items: VocabularyItem[],
  search: string,
  filters: VocabularyFilters
) => {
  const searchValue = search.trim().toLowerCase();
  const wordFilter = filters.word.trim().toLowerCase();
  const meaningFilter = filters.meaning.trim().toLowerCase();
  const exampleFilter = filters.example.trim().toLowerCase();
  const categoryFilter = filters.categoryId;

  return items.filter((item) => {
    if (searchValue && !item.word.toLowerCase().includes(searchValue)) {
      return false;
    }
    if (wordFilter && !item.word.toLowerCase().includes(wordFilter)) {
      return false;
    }
    if (meaningFilter && !item.meaning.toLowerCase().includes(meaningFilter)) {
      return false;
    }
    if (exampleFilter) {
      const exampleText = `${item.example ?? ""} ${item.example_meaning ?? ""}`
        .toLowerCase()
        .trim();
      if (!exampleText.includes(exampleFilter)) {
        return false;
      }
    }
    if (categoryFilter && item.category_id !== categoryFilter) {
      return false;
    }
    return true;
  });
};

export const getPagedItems = (
  items: VocabularyItem[],
  page: number,
  pageSize: number
) => {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedItems = items.slice(start, start + pageSize);

  return {
    totalItems,
    totalPages,
    currentPage,
    pagedItems,
  };
};
