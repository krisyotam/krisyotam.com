import { NextResponse } from 'next/server';
import { getMostWatchedGenres } from '@/lib/film-utils';

export async function GET() {
  try {
    const genres = await getMostWatchedGenres();
    return NextResponse.json(genres);
  } catch (error) {
    console.error('Error fetching film genres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch film genres' },
      { status: 500 }
    );
  }
} 