import { NextRequest, NextResponse } from 'next/server';
import { traktApiCall, handleTraktError } from '@/lib/trakt-api';
import { getTMDBShowDetails, searchTMDBShow, getTMDBPosterUrl } from '@/lib/tmdb-api';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log(`Fetching most watched shows from Trakt (limit: ${limit})`);
    
    // Get user's watched shows history from Trakt
    const watchedShows = await traktApiCall(`/users/me/watched/shows`);
    
    if (!watchedShows || !Array.isArray(watchedShows)) {
      console.log('No watched shows found');
      return NextResponse.json([]);
    }

    // Sort by plays (most watched first) and take the top ones
    const mostWatchedShows = watchedShows
      .sort((a: any, b: any) => (b.plays || 0) - (a.plays || 0))
      .slice(0, limit);

    // Transform Trakt data and fetch TMDB images
    const transformedShows = await Promise.all(
      mostWatchedShows.map(async (item: any) => {
        let posterUrl = null;
        let tmdbData = null;

        // Try to get TMDB data using the TMDB ID from Trakt
        if (item.show?.ids?.tmdb) {
          tmdbData = await getTMDBShowDetails(item.show.ids.tmdb);
        }
        
        // If no TMDB ID or data, try searching by title and year
        if (!tmdbData && item.show?.title) {
          tmdbData = await searchTMDBShow(item.show.title, item.show?.year);
        }

        // Get poster URL if we have TMDB data
        if (tmdbData?.poster_path) {
          posterUrl = getTMDBPosterUrl(tmdbData.poster_path);
        }

        return {
          id: item.show?.ids?.trakt || Math.random(),
          title: item.show?.title || 'Unknown Title',
          year: item.show?.year || null,
          posterUrl,
          plays: item.plays || 1,
          lastWatchedAt: item.last_watched_at || new Date().toISOString(),
          rating: item.show?.rating || null,
          genres: item.show?.genres || [],
          runtime: item.show?.runtime || null,
          overview: tmdbData?.overview || item.show?.overview || null,
          // Show specific data
          network: item.show?.network || null,
          status: item.show?.status || null,
          aired_episodes: item.show?.aired_episodes || null,
          // Additional Trakt specific data
          traktId: item.show?.ids?.trakt,
          imdbId: item.show?.ids?.imdb,
          tmdbId: item.show?.ids?.tmdb || tmdbData?.id
        };
      })
    );

    console.log(`Transformed ${transformedShows.length} most watched shows`);
    return NextResponse.json(transformedShows);
    
  } catch (error) {
    console.error('Error fetching Trakt most watched shows:', error);
    return handleTraktError(error);
  }
}
