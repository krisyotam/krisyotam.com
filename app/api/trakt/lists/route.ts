import { NextRequest, NextResponse } from 'next/server';
import { traktApiCall, handleTraktError } from '@/lib/trakt-api';
import { getTMDBMovieDetails, getTMDBShowDetails, getTMDBPosterUrl } from '@/lib/tmdb-api';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching user lists from Trakt');
    
    // Get user's lists from Trakt
    const lists = await traktApiCall('/users/me/lists');
    
    if (!lists || !Array.isArray(lists)) {
      console.log('No lists found');
      return NextResponse.json([]);
    }

    // Transform Trakt lists data
    const transformedLists = await Promise.all(
      lists.map(async (list: any) => {
        try {
          // Get list items
          const listItems = await traktApiCall(`/users/me/lists/${list.ids.slug}/items`);
          
          // Transform list items with TMDB images
          const items = await Promise.all(
            (listItems || []).slice(0, 20).map(async (item: any) => {
              let posterUrl = null;
              let title = '';
              let year = null;
              let type = 'unknown';

              if (item.movie) {
                type = 'movie';
                title = item.movie.title || 'Unknown Movie';
                year = item.movie.year;
                
                // Get TMDB poster for movie
                if (item.movie.ids?.tmdb) {
                  const tmdbDetails = await getTMDBMovieDetails(item.movie.ids.tmdb);
                  posterUrl = getTMDBPosterUrl(tmdbDetails?.poster_path || null);
                }
              } else if (item.show) {
                type = 'show';
                title = item.show.title || 'Unknown Show';
                year = item.show.year;
                
                // Get TMDB poster for show
                if (item.show.ids?.tmdb) {
                  const tmdbDetails = await getTMDBShowDetails(item.show.ids.tmdb);
                  posterUrl = getTMDBPosterUrl(tmdbDetails?.poster_path || null);
                }
              }

              return {
                id: item.movie?.ids?.trakt || item.show?.ids?.trakt || Math.random(),
                title,
                year,
                type,
                posterUrl,
                traktId: item.movie?.ids?.trakt || item.show?.ids?.trakt,
                imdbId: item.movie?.ids?.imdb || item.show?.ids?.imdb,
                tmdbId: item.movie?.ids?.tmdb || item.show?.ids?.tmdb,
                addedAt: item.listed_at || new Date().toISOString()
              };
            })
          );

          return {
            id: list.ids.trakt,
            name: list.name,
            description: list.description || '',
            itemCount: list.item_count || 0,
            privacy: list.privacy || 'private',
            createdAt: list.created_at,
            updatedAt: list.updated_at,
            items: items.filter(item => item.title !== ''), // Filter out items without titles
            slug: list.ids.slug
          };
        } catch (error) {
          console.error(`Error processing list ${list.name}:`, error);
          return {
            id: list.ids.trakt,
            name: list.name,
            description: list.description || '',
            itemCount: list.item_count || 0,
            privacy: list.privacy || 'private',
            createdAt: list.created_at,
            updatedAt: list.updated_at,
            items: [],
            slug: list.ids.slug
          };
        }
      })
    );

    console.log(`Transformed ${transformedLists.length} lists`);
    return NextResponse.json(transformedLists);
    
  } catch (error) {
    console.error('Error fetching Trakt lists:', error);
    return handleTraktError(error);
  }
}
