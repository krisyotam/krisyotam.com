import { NextRequest, NextResponse } from 'next/server';
import { getFavoriteShows } from '@/lib/film-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    const shows = await getFavoriteShows(limit);
    return NextResponse.json(shows);
  } catch (error) {
    console.error('Error fetching favorite shows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorite shows' },
      { status: 500 }
    );
  }
} 