import { NextResponse } from 'next/server'
import { getShortStories } from '@/lib/media-db'

export async function GET() {
  try {
    const shortStories = getShortStories()
    return NextResponse.json({ 'short-stories': shortStories })
  } catch (error) {
    console.error('Error reading short-stories:', error)
    return NextResponse.json({ 'short-stories': [] })
  }
}
