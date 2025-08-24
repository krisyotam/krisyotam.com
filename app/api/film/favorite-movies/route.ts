import { NextRequest, NextResponse } from 'next/server';
import { getFavoriteMovies } from '@/lib/film-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
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