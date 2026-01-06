import { NextResponse } from 'next/server'
import { getReadingAudiobooks } from '@/lib/media-db'

export async function GET() {
  try {
    const audiobooks = getReadingAudiobooks()
    return NextResponse.json({ audiobooks })
  } catch (error) {
    console.error('Error reading audiobooks:', error)
    return NextResponse.json({ audiobooks: [] })
  }
}
