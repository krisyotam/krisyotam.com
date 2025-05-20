import { NextRequest, NextResponse } from 'next/server';
import { getMostWatchedShows } from '@/lib/film-utils';

// Use static rendering
export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  try {
    // Use a fixed limit instead of URL params
    const limit = 10;
    
    const shows = await getMostWatchedShows(limit);
    return NextResponse.json(shows);
  } catch (error) {
    console.error('Error fetching most watched shows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch most watched shows' },
      { status: 500 }
    );
  }
} 