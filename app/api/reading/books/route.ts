import { NextResponse } from 'next/server'
import { getReadingBooks } from '@/lib/media-db'

export async function GET() {
  try {
    const books = getReadingBooks()
    return NextResponse.json({ books })
  } catch (error) {
    console.error('Error reading books:', error)
    return NextResponse.json({ books: [] })
  }
}
