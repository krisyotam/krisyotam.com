import { NextResponse } from 'next/server'
import { getFilms } from '@/lib/media-db'

export async function GET() {
  try {
    const films = getFilms()
    return NextResponse.json(films)
  } catch (error) {
    console.error('Error reading films catalog:', error)
    return NextResponse.json({ error: 'Failed to load films catalog' }, { status: 500 })
  }
}
