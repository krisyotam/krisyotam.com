import { NextRequest, NextResponse } from 'next/server';
import { getFavoriteShows } from '@/lib/film-utils';

// Use static rendering instead of dynamic
export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  try {
    // Use a fixed limit instead of getting it from URL params
    const limit = 10;
    
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