import { getUserSession } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const sess = await getUserSession(event)
  return sess || {}
})
