import { NextResponse } from 'next/server'
import { getReadingLists } from '@/lib/media-db'

export async function GET() {
  try {
    const lists = getReadingLists()
    // Transform to match original format (list_id -> id)
    const formattedLists = lists.map(list => ({
      id: list.list_id,
      title: list.title,
      description: list.description,
      author: list.author,
      books: list.books
    }))
    return NextResponse.json({ lists: formattedLists })
  } catch (error) {
    console.error('Error reading lists:', error)
    return NextResponse.json({ error: 'Failed to read reading lists data' }, { status: 500 })
  }
}
