import { NextRequest, NextResponse } from 'next/server';
import { getRecentShows } from '@/lib/film-utils';

// Use static rendering
export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  try {
    // Use a fixed limit
    const limit = 10;
    
    const shows = await getRecentShows(limit);
    return NextResponse.json(shows);
  } catch (error) {
    console.error('Error fetching recent shows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent shows' },
      { status: 500 }
    );
  }
} 