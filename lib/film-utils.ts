import { promises as fs } from 'fs';
import path from 'path';

export interface Movie {
  id: string;
  title: string;
  year: number;
  posterUrl: string;
  genres: string[];
  runtime: number;
  director: string;
  last_watched_at: string;
  rating: number;
  overview: string;
  times_watched?: number;
}

export interface Show {
  id: string;
  title: string;
  year: number;
  posterUrl: string;
  genres: string[];
  runtime_per_episode: number;
  total_seasons: number;
  total_episodes: number;
  watched_episodes: number;
  creator: string;
  last_watched_at: string;
  rating: number;
  overview: string;
}

export interface Stats {
  movies: number;
  episodes: number;
  minutes: number;
}

export interface Genre {
  name: string;
  count: number;
  percentage: number;
}

export async function getMovies(): Promise<Movie[]> {
  const filePath = path.join(process.cwd(), 'data/film/movies.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading movies:', error);
    return [];
  }
}

export async function getShows(): Promise<Show[]> {
  const filePath = path.join(process.cwd(), 'data/film/shows.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading shows:', error);
    return [];
  }
}

export async function getWatchedStats(): Promise<Stats> {
  try {
    const [movies, shows] = await Promise.all([getMovies(), getShows()]);
    
    // Calculate total episodes watched
    const episodesWatched = shows.reduce((total, show) => total + show.watched_episodes, 0);
    
    // Calculate total minutes watched (movies + shows)
    const movieMinutes = movies.reduce((total, movie) => total + movie.runtime, 0);
    const showMinutes = shows.reduce((total, show) => total + (show.runtime_per_episode * show.watched_episodes), 0);
    
    return {
      movies: movies.length,
      episodes: episodesWatched,
      minutes: movieMinutes + showMinutes,
    };
  } catch (error) {
    console.error('Error calculating watched stats:', error);
    return {
      movies: 0,
      episodes: 0,
      minutes: 0,
    };
  }
}

export async function getMostWatchedGenres(): Promise<Genre[]> {
  try {
    const [movies, shows] = await Promise.all([getMovies(), getShows()]);
    
    // Combine all genres from movies and shows
    const genreCounts: Record<string, number> = {};
    let totalGenreCount = 0;
    
    // Count movie genres
    movies.forEach(movie => {
      movie.genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        totalGenreCount++;
      });
    });
    
    // Count show genres
    shows.forEach(show => {
      show.genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        totalGenreCount++;
      });
    });
    
    // Convert to Genre array and sort by count (descending)
    const genres: Genre[] = Object.entries(genreCounts).map(([name, count]) => ({
      name,
      count,
      percentage: parseFloat(((count / totalGenreCount) * 100).toFixed(1)),
    }));
    
    return genres.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error calculating genre stats:', error);
    return [];
  }
}

export async function getRecentMovies(limit: number = 10): Promise<Movie[]> {
  try {
    const movies = await getMovies();
    
    // Sort by last_watched_at (descending)
    return movies
      .sort((a, b) => new Date(b.last_watched_at).getTime() - new Date(a.last_watched_at).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recent movies:', error);
    return [];
  }
}

export async function getRecentShows(limit: number = 10): Promise<Show[]> {
  try {
    const shows = await getShows();
    
    // Sort by last_watched_at (descending)
    return shows
      .sort((a, b) => new Date(b.last_watched_at).getTime() - new Date(a.last_watched_at).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recent shows:', error);
    return [];
  }
}

export async function getMostWatchedMovies(limit: number = 10): Promise<Movie[]> {
  try {
    const movies = await getMovies();
    
    // Sort by times_watched (descending) or default to 1 if not specified
    return movies
      .sort((a, b) => (b.times_watched || 1) - (a.times_watched || 1))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting most watched movies:', error);
    return [];
  }
}

export async function getMostWatchedShows(limit: number = 10): Promise<Show[]> {
  try {
    const shows = await getShows();
    
    // Sort by watched_episodes (descending)
    return shows
      .sort((a, b) => b.watched_episodes - a.watched_episodes)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting most watched shows:', error);
    return [];
  }
}

export async function getFavoriteMovies(limit: number = 10): Promise<Movie[]> {
  try {
    const movies = await getMovies();
    
    // Sort by ID (ascending)
    return movies
      .sort((a, b) => parseInt(a.id) - parseInt(b.id))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting favorite movies:', error);
    return [];
  }
}

export async function getFavoriteShows(limit: number = 10): Promise<Show[]> {
  try {
    const shows = await getShows();
    
    // Sort by rating (descending) and then by title
    return shows
      .sort((a, b) => b.rating - a.rating || a.title.localeCompare(b.title))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting favorite shows:', error);
    return [];
  }
} 