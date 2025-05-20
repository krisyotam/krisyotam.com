import { NextRequest, NextResponse } from 'next/server';
import { getMostWatchedMovies } from '@/lib/film-utils';

// Use static rendering
export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  try {
    // Use a fixed limit instead of URL params
    const limit = 10;
    
    const movies = await getMostWatchedMovies(limit);
    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching most watched movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch most watched movies' },
      { status: 500 }
    );
  }
} 