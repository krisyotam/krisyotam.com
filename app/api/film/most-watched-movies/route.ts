import { NextRequest, NextResponse } from 'next/server';
import { getMostWatchedMovies } from '@/lib/film-utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
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