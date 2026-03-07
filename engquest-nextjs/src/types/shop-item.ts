// Shared TypeScript types for shop items, inventory state, and cosmetic metadata.
export type ShopItemType = "frame" | "avatar";
export type ShopItemRarity = "common" | "rare" | "legendary";

export type ShopVisualItem = {
  _id: string;
  name: string;
  type: ShopItemType;
  imageUrl: string;
  renderKey?: string;
};

export type ShopCatalogItem = ShopVisualItem & {
  price: number;
  rarity: ShopItemRarity;
};

export type AdminShopItem = ShopCatalogItem & {
  isActive: boolean;
};
