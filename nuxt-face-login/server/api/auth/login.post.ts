import { readBody, createError } from 'h3'
import { readDB, euclidean } from '~~/server/utils/db'
import { setUserSession } from '~~/server/utils/session'  // <- nuevo nombre

const THRESHOLD = 0.55

export default defineEventHandler(async (event) => {
  const body = await readBody<{ descriptor: number[] }>(event)
  if (!body?.descriptor || !Array.isArray(body.descriptor)) {
    throw createError({ statusCode: 400, statusMessage: 'descriptor requerido' })
  }

  const db = await readDB()
  if (db.users.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No hay usuarios enrolados' })
  }

  let bestUser = ''
  let bestDist = Number.POSITIVE_INFINITY

  for (const u of db.users) {
    for (const d of u.descriptors) {
      const dist = euclidean(body.descriptor, d)
      if (dist < bestDist) {
        bestDist = dist
        bestUser = u.username
      }
    }
  }

  if (!bestUser || bestDist > THRESHOLD) {
    throw createError({ statusCode: 401, statusMessage: 'No coincide con ningún usuario' })
  }

  await setUserSession(event, { username: bestUser })
  return { ok: true, username: bestUser, dist: bestDist }
})
