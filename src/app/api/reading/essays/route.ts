import { NextResponse } from 'next/server'
import { getReadingEssays } from '@/lib/media-db'

export async function GET() {
  try {
    const essays = getReadingEssays()
    return NextResponse.json({ essays })
  } catch (error) {
    console.error('Error reading essays:', error)
    return NextResponse.json({ error: 'Failed to read essays data' }, { status: 500 })
  }
}
