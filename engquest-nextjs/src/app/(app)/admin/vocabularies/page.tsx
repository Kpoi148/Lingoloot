import AdminVocabulariesClient from "./AdminVocabulariesClient";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import Vocabulary from "@/models/Vocabulary";
import type {
  CategoryOption,
  VocabularyItem,
} from "./AdminVocabulariesClient";

export const dynamic = "force-dynamic";

const loadData = async (): Promise<{
  items: VocabularyItem[];
  categories: CategoryOption[];
}> => {
  await connectToDatabase();

  const vocabularies = await Vocabulary.find()
    .select("word ipa meaning example example_meaning media category_id created_at")
    .sort({ created_at: -1 })
    .lean();

  const categoryIds = Array.from(
    new Set(vocabularies.map((item) => String(item.category_id)))
  );

  const categories = await Category.find({ _id: { $in: categoryIds } })
    .select("name")
    .lean();

  const categoryMap = new Map(
    categories.map((category) => [String(category._id), category])
  );

  const items = vocabularies.map((item) => ({
    ...item,
    _id: item._id.toString(),
    category_id: String(item.category_id),
    category: categoryMap.get(String(item.category_id)) ?? null,
  }));

  return {
    items,
    categories: categories.map((category) => ({
      _id: category._id.toString(),
      name: category.name,
    })),
  };
};

export default async function AdminVocabulariesPage() {
  try {
    const { items, categories } = await loadData();
    return (
      <AdminVocabulariesClient
        initialItems={items}
        initialCategories={categories}
      />
    );
  } catch (error) {
    return (
      <AdminVocabulariesClient
        initialItems={[]}
        initialCategories={[]}
        initialError={
          error instanceof Error ? error.message : "Unable to load data."
        }
      />
    );
  }
}
