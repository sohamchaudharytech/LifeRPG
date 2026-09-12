import { Collection, Document } from "mongodb";
import { getDatabase } from "./mongodb";
import { FallbackCollection } from "./fallbackStore";

const fallbackUsers = new FallbackCollection("users");
const fallbackQuests = new FallbackCollection("quests");
const fallbackHistory = new FallbackCollection("history");

export async function getUsersCollection(): Promise<any> {
  try {
    const db = await getDatabase();
    const collection = db.collection("users");
    collection.createIndex({ email: 1 }, { unique: true }).catch(() => {});
    collection.createIndex({ username: 1 }).catch(() => {});
    return collection;
  } catch (err) {
    console.warn("MongoDB Atlas unavailable, utilizing persistent local storage fallback for users.");
    return fallbackUsers;
  }
}

export async function getQuestsCollection(): Promise<any> {
  try {
    const db = await getDatabase();
    const collection = db.collection("quests");
    collection.createIndex({ userId: 1, completed: 1 }).catch(() => {});
    collection.createIndex({ userId: 1, createdAt: -1 }).catch(() => {});
    return collection;
  } catch (err) {
    console.warn("MongoDB Atlas unavailable, utilizing persistent local storage fallback for quests.");
    return fallbackQuests;
  }
}

export async function getHistoryCollection(): Promise<any> {
  try {
    const db = await getDatabase();
    const collection = db.collection("history");
    collection.createIndex({ userId: 1, completedAt: -1 }).catch(() => {});
    return collection;
  } catch (err) {
    console.warn("MongoDB Atlas unavailable, utilizing persistent local storage fallback for history.");
    return fallbackHistory;
  }
}
