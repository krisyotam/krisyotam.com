import { NextRequest, NextResponse } from 'next/server';
import { getFavoriteMovies } from '@/lib/film-utils';

// Use static rendering instead of dynamic
export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  try {
    // Use a fixed limit instead of getting it from URL params
    const limit = 10;
    
    const movies = await getFavoriteMovies(limit);
    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching favorite movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorite movies' },
      { status: 500 }
    );
  }
} 