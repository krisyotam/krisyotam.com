const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  runtime?: number;
}

interface TMDBShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  genre_ids: number[];
  vote_average: number;
}

// Get movie details from TMDB
export async function getTMDBMovieDetails(tmdbId: number): Promise<TMDBMovie | null> {
  if (!TMDB_ACCESS_TOKEN || !tmdbId) return null;

  try {
    const response = await fetch(`${TMDB_API_BASE}/movie/${tmdbId}`, {
      headers: {
        'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`TMDB movie request failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching TMDB movie details:', error);
    return null;
  }
}

// Get TV show details from TMDB
export async function getTMDBShowDetails(tmdbId: number): Promise<TMDBShow | null> {
  if (!TMDB_ACCESS_TOKEN || !tmdbId) return null;

  try {
    const response = await fetch(`${TMDB_API_BASE}/tv/${tmdbId}`, {
      headers: {
        'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`TMDB TV request failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching TMDB TV details:', error);
    return null;
  }
}

// Search for movie by title and year to get TMDB ID
export async function searchTMDBMovie(title: string, year?: number): Promise<TMDBMovie | null> {
  if (!TMDB_ACCESS_TOKEN || !title) return null;

  try {
    const query = encodeURIComponent(title);
    const yearParam = year ? `&year=${year}` : '';
    
    const response = await fetch(`${TMDB_API_BASE}/search/movie?query=${query}${yearParam}`, {
      headers: {
        'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`TMDB movie search failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.results?.[0] || null;
  } catch (error) {
    console.error('Error searching TMDB movies:', error);
    return null;
  }
}

// Search for TV show by title and year to get TMDB ID
export async function searchTMDBShow(title: string, year?: number): Promise<TMDBShow | null> {
  if (!TMDB_ACCESS_TOKEN || !title) return null;

  try {
    const query = encodeURIComponent(title);
    const yearParam = year ? `&first_air_date_year=${year}` : '';
    
    const response = await fetch(`${TMDB_API_BASE}/search/tv?query=${query}${yearParam}`, {
      headers: {
        'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`TMDB TV search failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.results?.[0] || null;
  } catch (error) {
    console.error('Error searching TMDB TV shows:', error);
    return null;
  }
}

// Get full poster URL from TMDB
export function getTMDBPosterUrl(posterPath: string | null): string | null {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE}${posterPath}`;
}

// Get full backdrop URL from TMDB
export function getTMDBBackdropUrl(backdropPath: string | null): string | null {
  if (!backdropPath) return null;
  return `https://image.tmdb.org/t/p/w1280${backdropPath}`;
}
