import { clearUserSession } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  clearUserSession(event)
  return { ok: true }
})
