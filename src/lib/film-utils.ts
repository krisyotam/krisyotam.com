/**
 * ============================================================================
 * Film Utilities Library
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Filename: film-utils.ts
 * Description: Utility functions for film data, including movies and statistics.
 *              Data is fetched from media.db.
 * ============================================================================
 */

import {
  getMovies as getMoviesFromDb,
  type Movie as DbMovie,
} from "@/lib/media-db";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// DATA TRANSFORMATION
// ============================================================================

function transformDbMovie(dbMovie: DbMovie): Movie {
  return {
    id: String(dbMovie.id),
    title: dbMovie.title,
    year: dbMovie.year,
    posterUrl: dbMovie.poster_url,
    genres: dbMovie.genres,
    runtime: dbMovie.runtime,
    director: dbMovie.director,
    last_watched_at: dbMovie.last_watched_at,
    rating: dbMovie.rating,
    overview: dbMovie.overview,
    times_watched: dbMovie.times_watched,
  };
}

// ============================================================================
// MOVIE FUNCTIONS
// ============================================================================

export async function getMovies(): Promise<Movie[]> {
  try {
    const dbMovies = getMoviesFromDb();
    return dbMovies.map(transformDbMovie);
  } catch (error) {
    console.error("Error loading movies:", error);
    return [];
  }
}

export async function getShows(): Promise<Show[]> {
  // Shows functionality not currently used
  return [];
}

// ============================================================================
// STATISTICS FUNCTIONS
// ============================================================================

export async function getWatchedStats(): Promise<Stats> {
  try {
    const movies = await getMovies();

    // Calculate total minutes watched from movies
    const movieMinutes = movies.reduce(
      (total, movie) => total + movie.runtime,
      0
    );

    return {
      movies: movies.length,
      episodes: 0,
      minutes: movieMinutes,
    };
  } catch (error) {
    console.error("Error calculating watched stats:", error);
    return {
      movies: 0,
      episodes: 0,
      minutes: 0,
    };
  }
}

export async function getMostWatchedGenres(): Promise<Genre[]> {
  try {
    const movies = await getMovies();

    // Count genres from movies
    const genreCounts: Record<string, number> = {};
    let totalGenreCount = 0;

    movies.forEach((movie) => {
      movie.genres.forEach((genre) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        totalGenreCount++;
      });
    });

    // Convert to Genre array and sort by count (descending)
    const genres: Genre[] = Object.entries(genreCounts).map(
      ([name, count]) => ({
        name,
        count,
        percentage: parseFloat(((count / totalGenreCount) * 100).toFixed(1)),
      })
    );

    return genres.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Error calculating genre stats:", error);
    return [];
  }
}

// ============================================================================
// RECENT/TOP MOVIE FUNCTIONS
// ============================================================================

export async function getRecentMovies(limit: number = 10): Promise<Movie[]> {
  try {
    const movies = await getMovies();

    // Sort by last_watched_at (descending)
    return movies
      .sort(
        (a, b) =>
          new Date(b.last_watched_at).getTime() -
          new Date(a.last_watched_at).getTime()
      )
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting recent movies:", error);
    return [];
  }
}

export async function getRecentShows(limit: number = 10): Promise<Show[]> {
  // Shows functionality not currently used
  return [];
}

export async function getMostWatchedMovies(limit: number = 10): Promise<Movie[]> {
  try {
    const movies = await getMovies();

    // Sort by times_watched (descending) or default to 1 if not specified
    return movies
      .sort((a, b) => (b.times_watched || 1) - (a.times_watched || 1))
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting most watched movies:", error);
    return [];
  }
}

export async function getMostWatchedShows(limit: number = 10): Promise<Show[]> {
  // Shows functionality not currently used
  return [];
}

export async function getFavoriteMovies(limit: number = 10): Promise<Movie[]> {
  try {
    const movies = await getMovies();

    // Sort by ID (ascending)
    return movies
      .sort((a, b) => parseInt(a.id) - parseInt(b.id))
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting favorite movies:", error);
    return [];
  }
}

export async function getFavoriteShows(limit: number = 10): Promise<Show[]> {
  // Shows functionality not currently used
  return [];
}
