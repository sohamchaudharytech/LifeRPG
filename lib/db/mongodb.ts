import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  family: 4, // Ensures IPv4 routing on Node 22 / Atlas
};

let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  console.warn("⚠️ Warning: MONGODB_URI is not set in environment variables.");
}

export function getMongoClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      global._mongoClientPromise = undefined; // Reset on failure so next request can retry
      throw err;
    });
  }
  return global._mongoClientPromise;
}

export default getMongoClientPromise;


export async function getDatabase(dbName: string = "liferpg"): Promise<Db> {
  const connectedClient = await getMongoClientPromise();
  return connectedClient.db(dbName);
}

