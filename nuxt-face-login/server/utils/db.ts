// server/utils/db.ts
import { promises as fs } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'server', 'data', 'users.json');

export type User = {
  username: string;
  descriptors: number[][]; // múltiples capturas
};

type DB = { users: User[] };

async function ensureFile() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(join(process.cwd(), 'server', 'data'), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify({ users: [] }, null, 2), 'utf-8');
  }
}

export async function readDB(): Promise<DB> {
  await ensureFile();
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw) as DB;
}

export async function writeDB(db: DB) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

export function euclidean(a: number[], b: number[]) {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0);
    s += d * d;
  }
  return Math.sqrt(s);
}
