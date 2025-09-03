import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

async function getRedisValue(key: string): Promise<number> {
  const response = await fetch(`${REDIS_URL}/get/${key}`, {
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`
    }
  })
  const data = await response.json()
  return parseInt(data.result) || 0
}

async function setRedisValue(key: string, value: number): Promise<void> {
  await fetch(`${REDIS_URL}/set/${key}/${value}`, {
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`
    }
  })
}

export async function POST() {
  const cookieStore = cookies()
  
  if (cookieStore.has('has_liked')) {
    return NextResponse.json({ error: 'Already liked' }, { status: 400 })
  }

  const count = await getRedisValue('heart_count')
  const newCount = count + 1
  await setRedisValue('heart_count', newCount)
  
  // Set cookie to prevent multiple likes
  cookies().set('has_liked', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  })

  return NextResponse.json({ count: newCount })
}
