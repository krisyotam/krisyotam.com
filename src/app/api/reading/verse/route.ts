import { NextResponse } from 'next/server'
import { getReadingVerse } from '@/lib/media-db'

export async function GET() {
  try {
    const verse = getReadingVerse()
    return NextResponse.json({ verse })
  } catch (error) {
    console.error('Error reading verse:', error)
    return NextResponse.json({ verse: [] })
  }
}
