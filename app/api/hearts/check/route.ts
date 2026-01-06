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

export async function GET() {
  const cookieStore = await cookies()
  const hasLiked = cookieStore.has('has_liked')
  const count = await getRedisValue('heart_count')
  
  return NextResponse.json({ count, hasLiked })
}
