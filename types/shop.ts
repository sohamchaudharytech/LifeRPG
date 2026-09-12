export type ItemRarity = "Common" | "Rare" | "Epic" | "Legendary";
export type ItemType = "frame" | "theme" | "aura" | "badge";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  price: number;
  icon: string;
  accentColor: string;
  previewClass?: string;
}

export interface HistoryEntry {
  _id: string;
  userId: string;
  questId: string;
  questTitle: string;
  category: string;
  attribute: string;
  xpEarned: number;
  goldEarned: number;
  completedAt: Date;
}
