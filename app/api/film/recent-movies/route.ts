import { NextRequest, NextResponse } from 'next/server';
import { getRecentMovies } from '@/lib/film-utils';

// Use static rendering
export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  try {
    // Use a fixed limit
    const limit = 10;
    
    const movies = await getRecentMovies(limit);
    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching recent movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent movies' },
      { status: 500 }
    );
  }
} 