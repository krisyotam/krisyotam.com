import { NextResponse } from 'next/server'
import { getWantToRead } from '@/lib/media-db'

export async function GET() {
  try {
    const wantToRead = getWantToRead()
    return NextResponse.json({ 'want-to-read': wantToRead })
  } catch (error) {
    console.error('Error reading want-to-read:', error)
    return NextResponse.json({ 'want-to-read': [] })
  }
}
