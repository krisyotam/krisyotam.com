import { NextRequest, NextResponse } from 'next/server';
import { traktApiCall, handleTraktError } from '@/lib/trakt-api';
import { getTMDBMovieDetails, searchTMDBMovie, getTMDBPosterUrl } from '@/lib/tmdb-api';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log(`Fetching most watched movies from Trakt (limit: ${limit})`);
    
    // Get user's watched movies history from Trakt
    const watchedMovies = await traktApiCall(`/users/me/watched/movies`);
    
    if (!watchedMovies || !Array.isArray(watchedMovies)) {
      console.log('No watched movies found');
      return NextResponse.json([]);
    }

    // Sort by plays (most watched first) and take the top ones
    const mostWatchedMovies = watchedMovies
      .sort((a: any, b: any) => (b.plays || 0) - (a.plays || 0))
      .slice(0, limit);

    // Transform Trakt data and fetch TMDB images
    const transformedMovies = await Promise.all(
      mostWatchedMovies.map(async (item: any) => {
        let posterUrl = null;
        let tmdbData = null;

        // Try to get TMDB data using the TMDB ID from Trakt
        if (item.movie?.ids?.tmdb) {
          tmdbData = await getTMDBMovieDetails(item.movie.ids.tmdb);
        }
        
        // If no TMDB ID or data, try searching by title and year
        if (!tmdbData && item.movie?.title) {
          tmdbData = await searchTMDBMovie(item.movie.title, item.movie?.year);
        }

        // Get poster URL if we have TMDB data
        if (tmdbData?.poster_path) {
          posterUrl = getTMDBPosterUrl(tmdbData.poster_path);
        }

        return {
          id: item.movie?.ids?.trakt || Math.random(),
          title: item.movie?.title || 'Unknown Title',
          year: item.movie?.year || null,
          posterUrl,
          plays: item.plays || 1,
          lastWatchedAt: item.last_watched_at || new Date().toISOString(),
          rating: item.movie?.rating || null,
          genres: item.movie?.genres || [],
          runtime: tmdbData?.runtime || item.movie?.runtime || null,
          overview: tmdbData?.overview || item.movie?.overview || null,
          // Additional Trakt specific data
          traktId: item.movie?.ids?.trakt,
          imdbId: item.movie?.ids?.imdb,
          tmdbId: item.movie?.ids?.tmdb || tmdbData?.id
        };
      })
    );

    console.log(`Transformed ${transformedMovies.length} most watched movies`);
    return NextResponse.json(transformedMovies);
    
  } catch (error) {
    console.error('Error fetching Trakt most watched movies:', error);
    return handleTraktError(error);
  }
}
