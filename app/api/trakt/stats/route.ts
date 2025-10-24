import { NextRequest, NextResponse } from 'next/server';
import { getUserStats, handleTraktError } from '@/lib/trakt-api';

export async function GET(request: NextRequest) {
  try {
    // Fetch user stats from Trakt API
    const traktStats = await getUserStats();
    
    // Transform Trakt data to match expected format
    const transformedStats = {
      moviesWatched: traktStats.movies?.watched || 0,
      tvShowsWatched: traktStats.shows?.watched || 0, // Changed from episodes to shows
      episodesWatched: traktStats.episodes?.watched || 0, // Keep for reference
      timeWatchedMinutes: traktStats.movies?.minutes + traktStats.episodes?.minutes || 0, // Total minutes
      timeWatchedHours: Math.round((traktStats.movies?.minutes + traktStats.episodes?.minutes) / 60) || 0, // Convert to hours
      moviesCollected: traktStats.movies?.collected || 0,
      showsCollected: traktStats.shows?.collected || 0,
      episodesCollected: traktStats.episodes?.collected || 0,
      ratings: {
        movies: traktStats.movies?.ratings || 0,
        shows: traktStats.shows?.ratings || 0,
        episodes: traktStats.episodes?.ratings || 0
      },
      // Additional Trakt-specific stats
      network: traktStats.network || null
    };

    return NextResponse.json(transformedStats);
  } catch (error) {
    console.error('Error fetching Trakt stats:', error);
    return handleTraktError(error);
  }
}
