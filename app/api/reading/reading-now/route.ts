import { NextResponse } from 'next/server'
import { getReadingNow } from '@/lib/media-db'

export async function GET() {
  try {
    const readingNow = getReadingNow()
    return NextResponse.json({ 'reading-now': readingNow })
  } catch (error) {
    console.error('Error reading reading-now:', error)
    return NextResponse.json({ 'reading-now': [] })
  }
}
