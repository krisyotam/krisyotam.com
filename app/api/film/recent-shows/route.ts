import { NextRequest, NextResponse } from 'next/server';
import { getRecentShows } from '@/lib/film-utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
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