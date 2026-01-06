import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

export async function POST() {
  const cookieStore = await cookies()

  if (cookieStore.has('has_liked')) {
    return NextResponse.json({ error: 'Already liked' }, { status: 400 })
  }

  // Get current count
  const getResponse = await fetch(`${REDIS_URL}/get/heart_count`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
  })
  const getData = await getResponse.json()
  const count = parseInt(getData.result) || 0
  const newCount = count + 1

  // Set new count
  await fetch(`${REDIS_URL}/set/heart_count/${newCount}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
  })

  // Set cookie to prevent multiple likes
  ;(await cookies()).set('has_liked', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  })

  return NextResponse.json({ count: newCount })
}
