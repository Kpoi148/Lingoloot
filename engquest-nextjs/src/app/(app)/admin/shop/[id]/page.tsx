import ShopItemForm from "@/components/admin/ShopItemForm";
import { getShopItemById } from "@/actions/admin/shop.actions";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditShopItemPage({ params }: PageProps) {
    const { id } = await params;
    const item = await getShopItemById(id);

    if (!item) {
        notFound();
    }

    // Cast type strictly if needed or rely on loose matching since we control the shape
    const formData = {
        ...item,
        // Ensure specific string literals match if TS complains, mostly fine due to structure
        type: item.type as "frame" | "avatar",
        rarity: item.rarity as "common" | "rare" | "legendary",
    };

    return <ShopItemForm initialData={formData} isEditMode />;
}
