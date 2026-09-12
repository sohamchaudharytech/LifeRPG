export interface UserAttributes {
  strength: number;
  intellect: number;
  discipline: number;
  vitality: number;
  creativity: number;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  purchasedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  level: number;
  totalXp: number;
  currentXp: number;
  gold: number;
  streak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  attributes: UserAttributes;
  inventory: InventoryItem[];
  equippedTheme: string;
  equippedFrame: string;
  equippedAura?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = Omit<User, "passwordHash">;

export interface JWTPayload {
  sub: string;
  email: string;
  username?: string;
}
