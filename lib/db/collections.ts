import { ObjectId, Db } from "mongodb";
import { getDatabase } from "./mongodb";
import { FallbackCollection, getLocalDatabase } from "./fallbackStore";

const fallbackUsers = new FallbackCollection("users");
const fallbackQuests = new FallbackCollection("quests");
const fallbackHistory = new FallbackCollection("history");

let hasSyncedLocalData = false;

async function syncLocalDataToMongo(db: Db): Promise<void> {
  if (hasSyncedLocalData) return;
  hasSyncedLocalData = true;

  try {
    const local = getLocalDatabase();
    if (!local) return;

    if (local.users && local.users.length > 0) {
      const usersCol = db.collection("users");
      for (const u of local.users) {
        const doc = { ...u };
        if (typeof doc._id === "string") {
          try {
            doc._id = new ObjectId(doc._id);
          } catch {}
        }
        await usersCol.updateOne(
          { $or: [{ email: doc.email }, { username: doc.username }] },
          { $set: doc },
          { upsert: true }
        );
      }
      console.log(`[MongoDB Sync] Synchronized ${local.users.length} users to MongoDB.`);
    }

    if (local.quests && local.quests.length > 0) {
      const questsCol = db.collection("quests");
      for (const q of local.quests) {
        const doc = { ...q };
        if (typeof doc._id === "string") {
          try {
            doc._id = new ObjectId(doc._id);
          } catch {}
        }
        await questsCol.updateOne(
          { _id: doc._id },
          { $set: doc },
          { upsert: true }
        );
      }
      console.log(`[MongoDB Sync] Synchronized ${local.quests.length} quests to MongoDB.`);
    }

    if (local.history && local.history.length > 0) {
      const historyCol = db.collection("history");
      for (const h of local.history) {
        const doc = { ...h };
        if (typeof doc._id === "string") {
          try {
            doc._id = new ObjectId(doc._id);
          } catch {}
        }
        await historyCol.updateOne(
          { _id: doc._id },
          { $set: doc },
          { upsert: true }
        );
      }
      console.log(`[MongoDB Sync] Synchronized ${local.history.length} history items to MongoDB.`);
    }
  } catch (err: any) {
    console.error("[MongoDB Sync Error]: Failed to sync local data into MongoDB:", err.message);
  }
}

function handleDbError(err: any, collectionName: string) {
  if (err.message && (err.message.includes("SSL alert number 80") || err.message.includes("tlsv1 alert internal error"))) {
    console.warn(`⚠️ [MongoDB Connection Blocked]: Atlas IP Access List rejected TLS handshake. Please add your IP or 0.0.0.0/0 in MongoDB Atlas Network Access.`);
  } else {
    console.warn(`⚠️ [MongoDB Unavailable]: ${err.message}. Using persistent local storage fallback for ${collectionName}.`);
  }
}

export async function getUsersCollection(): Promise<any> {
  try {
    const db = await getDatabase();
    await syncLocalDataToMongo(db);
    const collection = db.collection("users");
    collection.createIndex({ email: 1 }, { unique: true }).catch(() => {});
    collection.createIndex({ username: 1 }).catch(() => {});
    return collection;
  } catch (err: any) {
    handleDbError(err, "users");
    return fallbackUsers;
  }
}

export async function getQuestsCollection(): Promise<any> {
  try {
    const db = await getDatabase();
    await syncLocalDataToMongo(db);
    const collection = db.collection("quests");
    collection.createIndex({ userId: 1, completed: 1 }).catch(() => {});
    collection.createIndex({ userId: 1, createdAt: -1 }).catch(() => {});
    return collection;
  } catch (err: any) {
    handleDbError(err, "quests");
    return fallbackQuests;
  }
}

export async function getHistoryCollection(): Promise<any> {
  try {
    const db = await getDatabase();
    await syncLocalDataToMongo(db);
    const collection = db.collection("history");
    collection.createIndex({ userId: 1, completedAt: -1 }).catch(() => {});
    return collection;
  } catch (err: any) {
    handleDbError(err, "history");
    return fallbackHistory;
  }
}

