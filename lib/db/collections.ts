import { Collection, Document } from "mongodb";
import { getDatabase } from "./mongodb";

export async function getUsersCollection(): Promise<Collection<Document>> {
  const db = await getDatabase();
  const collection = db.collection("users");
  // Ensure indexes
  collection.createIndex({ email: 1 }, { unique: true }).catch(() => {});
  collection.createIndex({ username: 1 }).catch(() => {});
  return collection;
}

export async function getQuestsCollection(): Promise<Collection<Document>> {
  const db = await getDatabase();
  const collection = db.collection("quests");
  collection.createIndex({ userId: 1, completed: 1 }).catch(() => {});
  collection.createIndex({ userId: 1, createdAt: -1 }).catch(() => {});
  return collection;
}

export async function getHistoryCollection(): Promise<Collection<Document>> {
  const db = await getDatabase();
  const collection = db.collection("history");
  collection.createIndex({ userId: 1, completedAt: -1 }).catch(() => {});
  return collection;
}
