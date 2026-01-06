import { NextResponse } from 'next/server'
import { getReadingPapers } from '@/lib/media-db'

export async function GET() {
  try {
    const papers = getReadingPapers()
    return NextResponse.json({ papers })
  } catch (error) {
    console.error('Error reading papers:', error)
    return NextResponse.json({ error: 'Failed to read papers data' }, { status: 500 })
  }
}
