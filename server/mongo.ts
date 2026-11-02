import { MongoClient, Db, AnyBulkWriteOperation } from 'mongodb';
import crypto from 'crypto';

/**
 * MongoDB persistence layer.
 * The app keeps its working state in memory (fast, synchronous routes) and this
 * layer loads it from MongoDB on startup and writes only the changed documents back.
 */

// Collections whose documents have no `id` field
const KEY_FN: Record<string, (d: any) => string> = {
  userRoles: (d) => `${d.userId}:${d.role}`,
};

function docKey(collection: string, doc: any): string {
  const fn = KEY_FN[collection];
  return fn ? fn(doc) : String(doc.id);
}

function hashDoc(doc: any): string {
  return crypto.createHash('sha1').update(JSON.stringify(doc)).digest('hex');
}

export class MongoStore {
  private client!: MongoClient;
  private db!: Db;
  // collection -> (key -> content hash) of what is currently stored in Mongo
  private snapshot = new Map<string, Map<string, string>>();
  private saving: Promise<void> = Promise.resolve();

  async connect(uri: string, dbName: string) {
    this.client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000, connectTimeoutMS: 3000 });
    await this.client.connect();
    this.db = this.client.db(dbName);
    await this.ensureIndexes();
    console.log(`[mongo] connected to database "${dbName}"`);
  }

  private async ensureIndexes() {
    await this.db.collection('users').createIndex({ email: 1 }, { unique: true });
    await this.db.collection('courses').createIndex({ slug: 1 });
    await this.db.collection('enrollments').createIndex({ userId: 1, courseId: 1 });
    await this.db.collection('sections').createIndex({ courseId: 1 });
    await this.db.collection('lessons').createIndex({ sectionId: 1 });
    await this.db.collection('supportTickets').createIndex({ userId: 1, updatedAt: -1 });
    await this.db.collection('orders').createIndex({ userId: 1, createdAt: -1 });
    await this.db.collection('orders').createIndex({ courseId: 1 });
    await this.db.collection('orders').createIndex({ status: 1 });
    await this.db.collection('learningActivity').createIndex({ userId: 1, date: 1 }, { unique: true });
    await this.db.collection('studyNotes').createIndex({ courseId: 1, sectionId: 1 });
    await this.db.collection('assignments').createIndex({ courseId: 1 });
    await this.db.collection('assignmentSubmissions').createIndex({ assignmentId: 1, userId: 1 });
  }

  /** Returns null when the database is empty (first run). */
  async loadAll(collections: string[]): Promise<Record<string, any[]> | null> {
    const out: Record<string, any[]> = {};
    let total = 0;
    for (const name of collections) {
      const rows = await this.db.collection(name).find({}).toArray();
      const docs = rows.map(({ _id, ...rest }) => rest);
      out[name] = docs;
      total += docs.length;
      this.rememberSnapshot(name, docs);
    }
    return total === 0 ? null : out;
  }

  private rememberSnapshot(name: string, docs: any[]) {
    const m = new Map<string, string>();
    for (const d of docs) m.set(docKey(name, d), hashDoc(d));
    this.snapshot.set(name, m);
  }

  /** Writes only new/changed documents and removes deleted ones. Calls are serialized. */
  save(state: Record<string, any[]>): Promise<void> {
    this.saving = this.saving.then(() => this.doSave(state)).catch((e) => {
      console.error('[mongo] save failed:', e);
    });
    return this.saving;
  }

  private async doSave(state: Record<string, any[]>) {
    for (const [name, docs] of Object.entries(state)) {
      if (!Array.isArray(docs)) continue;
      const prev = this.snapshot.get(name) ?? new Map<string, string>();
      const next = new Map<string, string>();
      const ops: AnyBulkWriteOperation<any>[] = [];

      for (const d of docs) {
        const key = docKey(name, d);
        const h = hashDoc(d);
        next.set(key, h);
        if (prev.get(key) !== h) {
          ops.push({ replaceOne: { filter: { _id: key as any }, replacement: { ...d }, upsert: true } });
        }
      }
      for (const key of prev.keys()) {
        if (!next.has(key)) ops.push({ deleteOne: { filter: { _id: key as any } } });
      }
      if (ops.length) {
        await this.db.collection(name).bulkWrite(ops, { ordered: false });
      }
      this.snapshot.set(name, next);
    }
  }

  async close() {
    await this.saving;
    await this.client?.close();
  }
}
