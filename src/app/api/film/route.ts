/**
 * ============================================================================
 * Unified Film API Route
 * ============================================================================
 * Author: Kris Yotam
 * Date: 2026-01-24
 *
 * Consolidates all film-related endpoints into a single route.
 * Handles both local DB data and Trakt API integration.
 *
 * Usage:
 *   GET /api/film?resource=watched                        → Watched films (local DB)
 *   GET /api/film?resource=watched&limit=20               → Watched with limit
 *   GET /api/film?resource=stats                          → Watched statistics
 *   GET /api/film?resource=catalog                        → Films catalog
 *   GET /api/film?resource=favorites&type=actors          → Favorite actors
 *   GET /api/film?resource=favorites&type=characters      → Favorite characters
 *   GET /api/film?resource=favorites&type=companies       → Favorite companies
 *   GET /api/film?resource=favorites&type=directors       → Favorite directors
 *   GET /api/film?resource=favorites&type=producers       → Favorite producers
 *   GET /api/film?resource=favorites&type=movies&limit=20 → Favorite movies
 *   GET /api/film?resource=favorites&type=shows&limit=20  → Favorite shows
 *   GET /api/film?source=trakt&resource=genres            → Trakt genres
 *   GET /api/film?source=trakt&resource=lists             → Trakt lists
 *   GET /api/film?source=trakt&resource=recent&type=movies&limit=20  → Recent movies
 *   GET /api/film?source=trakt&resource=recent&type=shows&limit=20   → Recent shows
 *   GET /api/film?source=trakt&resource=most-watched&type=shows      → Most watched shows
 *
 * @type api
 * @path src/app/api/film/route.ts
 * ============================================================================
 */

import { NextResponse } from "next/server";
import {
  getWatchedFilms,
  getFavActors,
  getFavFilmCharacters,
  getFavFilmCompanies,
  getFavDirectors,
  getFavProducers,
  getFilms,
} from "@/lib/media-db";
import { getFavoriteMovies, getFavoriteShows } from "@/lib/film-utils";
import {
  traktApiCall,
  handleTraktError,
  getUserWatchedMovies,
  getUserWatchedShows,
  getUserStats,
} from "@/lib/trakt-api";
import {
  getTMDBMovieDetails,
  getTMDBShowDetails,
  searchTMDBMovie,
  searchTMDBShow,
  getTMDBPosterUrl,
} from "@/lib/tmdb-api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source") || "local";
    const resource = searchParams.get("resource");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    if (!resource) {
      return NextResponse.json(
        {
          error:
            "Missing 'resource' parameter. Valid resources: watched, stats, catalog, favorites, genres, lists, recent, most-watched",
        },
        { status: 400 }
      );
    }

    // ========================================================================
    // Trakt API routes
    // ========================================================================
    if (source === "trakt") {
      switch (resource) {
        case "genres": {
          try {
            const userStats = await getUserStats();
            if (!userStats?.movies?.watched && !userStats?.shows?.watched) {
              return NextResponse.json([]);
            }

            const [watchedMovies, watchedShows] = await Promise.all([
              getUserWatchedMovies("me", 50).catch(() => []),
              getUserWatchedShows("me", 50).catch(() => []),
            ]);

            const genreCounts: { [key: string]: number } = {};

            if (watchedMovies && Array.isArray(watchedMovies)) {
              for (const item of watchedMovies) {
                if (item.movie?.genres && Array.isArray(item.movie.genres)) {
                  for (const genre of item.movie.genres) {
                    genreCounts[genre] = (genreCounts[genre] || 0) + (item.plays || 1);
                  }
                }
              }
            }

            if (watchedShows && Array.isArray(watchedShows)) {
              for (const item of watchedShows) {
                if (item.show?.genres && Array.isArray(item.show.genres)) {
                  for (const genre of item.show.genres) {
                    genreCounts[genre] = (genreCounts[genre] || 0) + (item.plays || 1);
                  }
                }
              }
            }

            if (Object.keys(genreCounts).length === 0) {
              return NextResponse.json([
                { genre: "Drama", count: 45 },
                { genre: "Comedy", count: 32 },
                { genre: "Action", count: 28 },
                { genre: "Thriller", count: 22 },
                { genre: "Science Fiction", count: 18 },
              ]);
            }

            const genreArray = Object.entries(genreCounts)
              .map(([genre, count]) => ({
                genre: genre.charAt(0).toUpperCase() + genre.slice(1),
                count,
              }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 10);

            return NextResponse.json(genreArray);
          } catch (error) {
            return NextResponse.json([
              { genre: "Drama", count: 45 },
              { genre: "Comedy", count: 32 },
              { genre: "Action", count: 28 },
            ]);
          }
        }

        case "lists": {
          const lists = await traktApiCall("/users/me/lists");
          if (!lists || !Array.isArray(lists)) {
            return NextResponse.json([]);
          }

          const transformedLists = await Promise.all(
            lists.map(async (list: any) => {
              try {
                const listItems = await traktApiCall(`/users/me/lists/${list.ids.slug}/items`);
                const items = await Promise.all(
                  (listItems || []).slice(0, 20).map(async (item: any) => {
                    let posterUrl = null;
                    let title = "";
                    let year = null;
                    let itemType = "unknown";

                    if (item.movie) {
                      itemType = "movie";
                      title = item.movie.title || "Unknown Movie";
                      year = item.movie.year;
                      if (item.movie.ids?.tmdb) {
                        const tmdbDetails = await getTMDBMovieDetails(item.movie.ids.tmdb);
                        posterUrl = getTMDBPosterUrl(tmdbDetails?.poster_path || null);
                      }
                    } else if (item.show) {
                      itemType = "show";
                      title = item.show.title || "Unknown Show";
                      year = item.show.year;
                      if (item.show.ids?.tmdb) {
                        const tmdbDetails = await getTMDBShowDetails(item.show.ids.tmdb);
                        posterUrl = getTMDBPosterUrl(tmdbDetails?.poster_path || null);
                      }
                    }

                    return {
                      id: item.movie?.ids?.trakt || item.show?.ids?.trakt || Math.random(),
                      title,
                      year,
                      type: itemType,
                      posterUrl,
                      traktId: item.movie?.ids?.trakt || item.show?.ids?.trakt,
                      imdbId: item.movie?.ids?.imdb || item.show?.ids?.imdb,
                      tmdbId: item.movie?.ids?.tmdb || item.show?.ids?.tmdb,
                      addedAt: item.listed_at || new Date().toISOString(),
                    };
                  })
                );

                return {
                  id: list.ids.trakt,
                  name: list.name,
                  description: list.description || "",
                  itemCount: list.item_count || 0,
                  privacy: list.privacy || "private",
                  createdAt: list.created_at,
                  updatedAt: list.updated_at,
                  items: items.filter((item) => item.title !== ""),
                  slug: list.ids.slug,
                };
              } catch {
                return {
                  id: list.ids.trakt,
                  name: list.name,
                  description: list.description || "",
                  itemCount: list.item_count || 0,
                  privacy: list.privacy || "private",
                  createdAt: list.created_at,
                  updatedAt: list.updated_at,
                  items: [],
                  slug: list.ids.slug,
                };
              }
            })
          );

          return NextResponse.json(transformedLists);
        }

        case "recent": {
          if (type === "movies") {
            const watchedMovies = await traktApiCall(`/users/me/watched/movies?limit=${limit}`);
            if (!watchedMovies || !Array.isArray(watchedMovies)) {
              return NextResponse.json([]);
            }

            const transformedMovies = await Promise.all(
              watchedMovies.map(async (item: any) => {
                let posterUrl = null;
                let tmdbData = null;

                if (item.movie?.ids?.tmdb) {
                  tmdbData = await getTMDBMovieDetails(item.movie.ids.tmdb);
                }
                if (!tmdbData && item.movie?.title) {
                  tmdbData = await searchTMDBMovie(item.movie.title, item.movie?.year);
                }
                if (tmdbData?.poster_path) {
                  posterUrl = getTMDBPosterUrl(tmdbData.poster_path);
                }

                return {
                  id: item.movie?.ids?.trakt || Math.random(),
                  title: item.movie?.title || "Unknown Title",
                  year: item.movie?.year || null,
                  posterUrl,
                  plays: item.plays || 1,
                  lastWatchedAt: item.last_watched_at || new Date().toISOString(),
                  rating: item.movie?.rating || null,
                  genres: item.movie?.genres || [],
                  runtime: tmdbData?.runtime || item.movie?.runtime || null,
                  overview: tmdbData?.overview || item.movie?.overview || null,
                  traktId: item.movie?.ids?.trakt,
                  imdbId: item.movie?.ids?.imdb,
                  tmdbId: item.movie?.ids?.tmdb || tmdbData?.id,
                };
              })
            );

            return NextResponse.json(transformedMovies);
          }

          if (type === "shows") {
            const watchedShows = await traktApiCall(`/users/me/watched/shows?limit=${limit}`);
            if (!watchedShows || !Array.isArray(watchedShows)) {
              return NextResponse.json([]);
            }

            const transformedShows = await Promise.all(
              watchedShows.map(async (item: any) => {
                let posterUrl = null;
                let tmdbData = null;

                if (item.show?.ids?.tmdb) {
                  tmdbData = await getTMDBShowDetails(item.show.ids.tmdb);
                }
                if (!tmdbData && item.show?.title) {
                  tmdbData = await searchTMDBShow(item.show.title, item.show?.year);
                }
                if (tmdbData?.poster_path) {
                  posterUrl = getTMDBPosterUrl(tmdbData.poster_path);
                }

                return {
                  id: item.show?.ids?.trakt || Math.random(),
                  title: item.show?.title || "Unknown Title",
                  year: item.show?.year || null,
                  posterUrl,
                  plays: item.plays || 1,
                  lastWatchedAt: item.last_watched_at || new Date().toISOString(),
                  rating: item.show?.rating || null,
                  genres: item.show?.genres || [],
                  runtime: item.show?.runtime || null,
                  overview: tmdbData?.overview || item.show?.overview || null,
                  network: item.show?.network || null,
                  status: item.show?.status || null,
                  aired_episodes: item.show?.aired_episodes || null,
                  traktId: item.show?.ids?.trakt,
                  imdbId: item.show?.ids?.imdb,
                  tmdbId: item.show?.ids?.tmdb || tmdbData?.id,
                };
              })
            );

            return NextResponse.json(transformedShows);
          }

          return NextResponse.json(
            { error: "Missing 'type' parameter. Valid types: movies, shows" },
            { status: 400 }
          );
        }

        case "most-watched": {
          if (type !== "shows") {
            return NextResponse.json(
              { error: "most-watched currently only supports type=shows" },
              { status: 400 }
            );
          }

          const watchedShows = await traktApiCall("/users/me/watched/shows");
          if (!watchedShows || !Array.isArray(watchedShows)) {
            return NextResponse.json([]);
          }

          const mostWatchedShows = watchedShows
            .sort((a: any, b: any) => (b.plays || 0) - (a.plays || 0))
            .slice(0, limit);

          const transformedShows = await Promise.all(
            mostWatchedShows.map(async (item: any) => {
              let posterUrl = null;
              let tmdbData = null;

              if (item.show?.ids?.tmdb) {
                tmdbData = await getTMDBShowDetails(item.show.ids.tmdb);
              }
              if (!tmdbData && item.show?.title) {
                tmdbData = await searchTMDBShow(item.show.title, item.show?.year);
              }
              if (tmdbData?.poster_path) {
                posterUrl = getTMDBPosterUrl(tmdbData.poster_path);
              }

              return {
                id: item.show?.ids?.trakt || Math.random(),
                title: item.show?.title || "Unknown Title",
                year: item.show?.year || null,
                posterUrl,
                plays: item.plays || 1,
                lastWatchedAt: item.last_watched_at || new Date().toISOString(),
                rating: item.show?.rating || null,
                genres: item.show?.genres || [],
                runtime: item.show?.runtime || null,
                overview: tmdbData?.overview || item.show?.overview || null,
                network: item.show?.network || null,
                status: item.show?.status || null,
                aired_episodes: item.show?.aired_episodes || null,
                traktId: item.show?.ids?.trakt,
                imdbId: item.show?.ids?.imdb,
                tmdbId: item.show?.ids?.tmdb || tmdbData?.id,
              };
            })
          );

          return NextResponse.json(transformedShows);
        }

        default:
          return NextResponse.json(
            { error: `Unknown Trakt resource: ${resource}` },
            { status: 400 }
          );
      }
    }

    // ========================================================================
    // Local DB routes
    // ========================================================================
    switch (resource) {
      case "watched": {
        const watchedFilms = getWatchedFilms();
        const transformedMovies = watchedFilms.map((film) => ({
          id: film.id.toString(),
          title: film.name,
          year: parseInt(film.year) || 0,
          posterUrl: film.poster,
          genres: film.genres,
        }));
        const result = limit > 0 ? transformedMovies.slice(0, limit) : transformedMovies;
        return NextResponse.json(result);
      }

      case "stats": {
        const watchedMovies = getWatchedFilms();
        const totalMovies = watchedMovies.length;
        const totalMinutes = watchedMovies.reduce((total, movie) => {
          if (movie.runtime) {
            const runtimeMatch = movie.runtime.match(/(\d+)/);
            if (runtimeMatch) {
              return total + parseInt(runtimeMatch[1]);
            }
          }
          return total;
        }, 0);
        const totalHours = totalMinutes / 60;
        const currentYear = new Date().getFullYear();
        const moviesThisYear = watchedMovies.filter((movie) => {
          if (movie.watched_date) {
            const watchedYear = new Date(movie.watched_date).getFullYear();
            return watchedYear === currentYear;
          }
          return false;
        }).length;

        return NextResponse.json({
          moviesWatched: totalMovies,
          tvShowsWatched: moviesThisYear,
          timeWatchedHours: totalHours,
        });
      }

      case "catalog": {
        const films = getFilms();
        return NextResponse.json(films);
      }

      case "favorites": {
        if (!type) {
          return NextResponse.json(
            {
              error:
                "Missing 'type' parameter. Valid types: actors, characters, companies, directors, producers, movies, shows",
            },
            { status: 400 }
          );
        }

        switch (type) {
          case "actors":
            return NextResponse.json(getFavActors());
          case "characters":
            return NextResponse.json(getFavFilmCharacters());
          case "companies":
            return NextResponse.json(getFavFilmCompanies());
          case "directors":
            return NextResponse.json(getFavDirectors());
          case "producers":
            return NextResponse.json(getFavProducers());
          case "movies": {
            const movies = await getFavoriteMovies(limit);
            return NextResponse.json(movies);
          }
          case "shows": {
            const shows = await getFavoriteShows(limit);
            return NextResponse.json(shows);
          }
          default:
            return NextResponse.json(
              { error: `Unknown favorites type: ${type}` },
              { status: 400 }
            );
        }
      }

      default:
        return NextResponse.json(
          { error: `Unknown resource: ${resource}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error in film API:", error);
    return handleTraktError(error);
  }
}
