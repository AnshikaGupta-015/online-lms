import 'dotenv/config';
import { MongoClient } from 'mongodb';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.log('Usage: npx tsx server/makeAdmin.ts your@email.com');
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI!);
await client.connect();
const db = client.db(process.env.MONGODB_DB || 'learnhub');
const users = db.collection('users');

const res = await users.updateOne({ email }, { $set: { role: 'admin' } });

if (res.matchedCount === 0) {
  console.log('Is email ka user nahi mila. Maujooda users:');
  console.log((await users.find({}, { projection: { email: 1, role: 1 } }).toArray()));
} else {
  console.log(`${email} ab admin hai.`);
}
await client.close();