import { NextResponse } from 'next/server'
import { getReadingLog } from '@/lib/media-db'

export async function GET() {
  try {
    const readingLog = getReadingLog()
    return NextResponse.json({ 'reading-log': readingLog })
  } catch (error) {
    console.error('Error reading reading-log:', error)
    return NextResponse.json({ error: 'Failed to read reading log data' }, { status: 500 })
  }
}
