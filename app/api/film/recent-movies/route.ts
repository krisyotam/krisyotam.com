import { NextRequest, NextResponse } from 'next/server';
import { getRecentMovies } from '@/lib/film-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
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