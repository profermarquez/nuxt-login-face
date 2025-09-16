// server/utils/session.ts
import type { H3Event } from 'h3'
import { setCookie, getCookie, deleteCookie } from 'h3'
import { SignJWT, jwtVerify } from 'jose'

const COOKIE = 'sid'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 días

function getKey(secret: string) {
  return new TextEncoder().encode(secret)
}

export async function setUserSession(event: H3Event, payload: { username: string }) {
  const { jwtSecret } = useRuntimeConfig()
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getKey(jwtSecret))

  setCookie(event, COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export async function getUserSession(event: H3Event) {
  const { jwtSecret } = useRuntimeConfig()
  const token = getCookie(event, COOKIE)
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getKey(jwtSecret))
    return payload as { username: string }
  } catch {
    return null
  }
}

export function clearUserSession(event: H3Event) {
  deleteCookie(event, COOKIE, { path: '/' })
}
