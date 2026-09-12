import { MongoClient } from "mongodb";

const uri = "mongodb+srv://xeref54983_db_user:BGnF4u7DaTV3LoXI@hackathon.wsisru4.mongodb.net/liferpg?appName=hackathon";

async function testConnection() {
  console.log("Testing with tls: true, tlsInsecure: true...");
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      tls: true,
      tlsAllowInvalidCertificates: false,
    });
    await client.connect();
    console.log("Success with standard TLS!");
    const db = client.db("liferpg");
    const ping = await db.command({ ping: 1 });
    console.log("Ping:", ping);
    await client.close();
    return;
  } catch (err) {
    console.error("Standard TLS error:", err.message);
  }

  console.log("Testing with family: 4 (IPv4 force)...");
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      family: 4,
    });
    await client.connect();
    console.log("Success with IPv4!");
    const db = client.db("liferpg");
    const ping = await db.command({ ping: 1 });
    console.log("Ping:", ping);
    await client.close();
    return;
  } catch (err) {
    console.error("IPv4 error:", err.message);
  }
}

testConnection();
