import { NextRequest, NextResponse } from 'next/server';
import { getFavoritesByType } from '@/lib/media-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const section = searchParams.get('section') || 'film';

    // Get favorites from media db favorites table
    const dbFavorites = getFavoritesByType(section);

    const favorites = dbFavorites.map(f => ({
      title: f.title,
      cover: f.cover,
      link: f.link,
      // Add albumCover for music section
      ...(section === 'music' ? { albumCover: f.cover } : {})
    }));

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}
