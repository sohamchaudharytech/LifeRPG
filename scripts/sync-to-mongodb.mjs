import { MongoClient, ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "local_db.json");

// Load .env.local manually if not in env
let uri = process.env.MONGODB_URI;
if (!uri && fs.existsSync(".env.local")) {
  const content = fs.readFileSync(".env.local", "utf-8");
  const match = content.match(/MONGODB_URI=(.*)/);
  if (match) {
    uri = match[1].trim();
  }
}

console.log("=========================================");
console.log("LifeRPG -> MongoDB Migration & Diagnostic");
console.log("=========================================");
console.log("Target URI:", uri ? uri.replace(/:([^:@]+)@/, ":****@") : "NOT SET");

if (!uri) {
  console.error("❌ MONGODB_URI is not set!");
  process.exit(1);
}

async function run() {
  console.log("\n1. Connecting to MongoDB...");
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    family: 4,
  });

  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB!");

    const db = client.db("liferpg");
    const ping = await db.command({ ping: 1 });
    console.log("✅ MongoDB Ping response:", ping);

    // Read local_db.json
    if (!fs.existsSync(DB_FILE)) {
      console.log("No local .data/local_db.json found to migrate.");
      await client.close();
      return;
    }

    const localData = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    console.log("\n2. Found local data to migrate:");
    console.log(`   - Users: ${localData.users?.length || 0}`);
    console.log(`   - Quests: ${localData.quests?.length || 0}`);
    console.log(`   - History: ${localData.history?.length || 0}`);

    const usersCol = db.collection("users");
    const questsCol = db.collection("quests");
    const historyCol = db.collection("history");

    // Ensure indexes
    await usersCol.createIndex({ email: 1 }, { unique: true }).catch(() => {});
    await usersCol.createIndex({ username: 1 }).catch(() => {});
    await questsCol.createIndex({ userId: 1, completed: 1 }).catch(() => {});
    await historyCol.createIndex({ userId: 1, completedAt: -1 }).catch(() => {});

    // Migrate Users
    if (localData.users?.length > 0) {
      for (const u of localData.users) {
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
      console.log(`✅ Users synced: ${localData.users.length}`);
    }

    // Migrate Quests
    if (localData.quests?.length > 0) {
      for (const q of localData.quests) {
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
      console.log(`✅ Quests synced: ${localData.quests.length}`);
    }

    // Migrate History
    if (localData.history?.length > 0) {
      for (const h of localData.history) {
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
      console.log(`✅ History synced: ${localData.history.length}`);
    }

    // Verify Counts in MongoDB
    const usersCount = await usersCol.countDocuments();
    const questsCount = await questsCol.countDocuments();
    const historyCount = await historyCol.countDocuments();

    console.log("\n=========================================");
    console.log("VERIFIED MONGODB COLLECTIONS:");
    console.log(`   📁 Database: liferpg`);
    console.log(`   👤 users:   ${usersCount} documents`);
    console.log(`   ⚔️  quests:  ${questsCount} documents`);
    console.log(`   📜 history: ${historyCount} documents`);
    console.log("=========================================");
    console.log("🎉 MongoDB migration and verification complete!");

    await client.close();
  } catch (err) {
    console.error("\n❌ MongoDB Connection Error:", err.message);
    if (err.message.includes("SSL alert number 80") || err.message.includes("tlsv1 alert internal error")) {
      console.error("\n👉 CAUSE: MongoDB Atlas IP Access List restriction.");
      console.error("   Atlas rejects connections with 'SSL alert 80' when the client's current IP");
      console.error("   is not added in the MongoDB Atlas dashboard under: Network Access -> IP Access List.");
      console.error("   Solution: In MongoDB Atlas, go to 'Network Access' -> 'Add IP Address' -> add 0.0.0.0/0 (Allow access from anywhere).");
    }
    process.exit(1);
  }
}

run();
