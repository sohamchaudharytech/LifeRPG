import fs from "fs";
import path from "path";
import { ObjectId } from "mongodb";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "local_db.json");

interface LocalDatabase {
  users: any[];
  quests: any[];
  history: any[];
}

function ensureDataFile(): LocalDatabase {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initial: LocalDatabase = { users: [], quests: [], history: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  try {
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    const initial: LocalDatabase = { users: [], quests: [], history: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
}

function saveData(data: LocalDatabase) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local db fallback:", err);
  }
}

function matchesQuery(doc: any, query: any): boolean {
  if (!query || Object.keys(query).length === 0) return true;
  for (const key of Object.keys(query)) {
    const expected = query[key];
    const actual = doc[key];

    if (key === "_id") {
      const actualStr = actual ? actual.toString() : "";
      const expectedStr = expected ? expected.toString() : "";
      if (actualStr !== expectedStr) return false;
      continue;
    }

    if (expected !== undefined && actual !== expected) {
      return false;
    }
  }
  return true;
}

export class FallbackCollection {
  collectionName: keyof LocalDatabase;

  constructor(name: keyof LocalDatabase) {
    this.collectionName = name;
  }

  private getItems(): any[] {
    const db = ensureDataFile();
    return db[this.collectionName] || [];
  }

  private setItems(items: any[]) {
    const db = ensureDataFile();
    db[this.collectionName] = items;
    saveData(db);
  }

  async findOne(query: any): Promise<any | null> {
    const items = this.getItems();
    const found = items.find((item) => matchesQuery(item, query));
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  find(query: any = {}) {
    const items = this.getItems();
    let matched = items.filter((item) => matchesQuery(item, query));

    return {
      sort: (sortSpec: any) => {
        const key = Object.keys(sortSpec)[0];
        const dir = sortSpec[key];
        matched.sort((a, b) => {
          if (a[key] < b[key]) return dir === 1 ? -1 : 1;
          if (a[key] > b[key]) return dir === 1 ? 1 : -1;
          return 0;
        });
        return {
          limit: (n: number) => ({
            toArray: async () => matched.slice(0, n),
          }),
          toArray: async () => JSON.parse(JSON.stringify(matched)),
        };
      },
      limit: (n: number) => ({
        toArray: async () => matched.slice(0, n),
      }),
      toArray: async () => JSON.parse(JSON.stringify(matched)),
    };
  }

  async insertOne(doc: any): Promise<{ insertedId: any }> {
    const items = this.getItems();
    const id = doc._id || new ObjectId();
    const newDoc = {
      ...doc,
      _id: id,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: doc.updatedAt || new Date().toISOString(),
    };
    items.push(newDoc);
    this.setItems(items);
    return { insertedId: id };
  }

  async insertMany(docs: any[]): Promise<{ insertedCount: number }> {
    const items = this.getItems();
    const inserted = docs.map((doc) => ({
      ...doc,
      _id: doc._id || new ObjectId(),
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: doc.updatedAt || new Date().toISOString(),
    }));
    items.push(...inserted);
    this.setItems(items);
    return { insertedCount: inserted.length };
  }

  async updateOne(filter: any, update: any): Promise<{ modifiedCount: number }> {
    const items = this.getItems();
    const index = items.findIndex((item) => matchesQuery(item, filter));
    if (index === -1) return { modifiedCount: 0 };

    const item = items[index];
    if (update.$set) {
      for (const k of Object.keys(update.$set)) {
        if (k.includes(".")) {
          const parts = k.split(".");
          if (!item[parts[0]]) item[parts[0]] = {};
          item[parts[0]][parts[1]] = update.$set[k];
        } else {
          item[k] = update.$set[k];
        }
      }
    }
    if (update.$push) {
      for (const k of Object.keys(update.$push)) {
        if (!item[k]) item[k] = [];
        item[k].push(update.$push[k]);
      }
    }

    item.updatedAt = new Date().toISOString();
    items[index] = item;
    this.setItems(items);
    return { modifiedCount: 1 };
  }

  async deleteOne(filter: any): Promise<{ deletedCount: number }> {
    const items = this.getItems();
    const index = items.findIndex((item) => matchesQuery(item, filter));
    if (index === -1) return { deletedCount: 0 };
    items.splice(index, 1);
    this.setItems(items);
    return { deletedCount: 1 };
  }

  async deleteMany(filter: any): Promise<{ deletedCount: number }> {
    const items = this.getItems();
    const remaining = items.filter((item) => !matchesQuery(item, filter));
    const deletedCount = items.length - remaining.length;
    this.setItems(remaining);
    return { deletedCount };
  }

  async createIndex(): Promise<string> {
    return "index_ok";
  }
}
