// server/api/faces/enroll.post.ts
import { readBody, createError } from 'h3';
import { readDB, writeDB } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username: string; descriptor: number[] }>(event);
  if (!body?.username || !Array.isArray(body.descriptor) || body.descriptor.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'username y descriptor son requeridos' });
  }

  const db = await readDB();
  let user = db.users.find(u => u.username === body.username);
  if (!user) {
    user = { username: body.username, descriptors: [] };
    db.users.push(user);
  }
  user.descriptors.push(body.descriptor);
  await writeDB(db);
  return { ok: true };
});
