/**
 * ============================================================================
 * Unified TV API Route
 * ============================================================================
 * Author: Kris Yotam
 * Date: 2026-02-05
 *
 * Consolidates all TV-related endpoints into a single route.
 *
 * Usage:
 *   GET /api/tv?resource=watched                    → Watched TV shows
 *   GET /api/tv?resource=watched&limit=20           → Watched with limit
 *   GET /api/tv?resource=stats                      → Watch statistics
 *   GET /api/tv?resource=favorites&type=actors      → Favorite actors
 *   GET /api/tv?resource=favorites&type=characters  → Favorite characters
 *   GET /api/tv?resource=favorites&type=networks    → Favorite networks
 *   GET /api/tv?resource=favorites&type=showrunners → Favorite showrunners
 *   GET /api/tv?resource=favorites&type=shows       → Favorite shows
 *
 * @type api
 * @path src/app/api/tv/route.ts
 * ============================================================================
 */

import { NextResponse } from "next/server";
import {
  getTvWatched,
  getFavTvActors,
  getFavTvCharacters,
  getFavTvNetworks,
  getFavShowrunners,
  getFavTvShows,
} from "@/lib/media-db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get("resource");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    if (!resource) {
      return NextResponse.json(
        {
          error:
            "Missing 'resource' parameter. Valid resources: watched, stats, favorites",
        },
        { status: 400 }
      );
    }

    switch (resource) {
      case "watched": {
        const watchedShows = getTvWatched();
        const transformedShows = watchedShows.map((show) => ({
          id: show.id.toString(),
          title: show.name,
          year: show.year ? parseInt(show.year) : null,
          posterUrl: show.poster,
          genres: show.genres ? show.genres.split(", ") : [],
          seasons: show.seasons,
          episodes: show.episodes,
        }));
        const result = limit > 0 ? transformedShows.slice(0, limit) : transformedShows;
        return NextResponse.json(result);
      }

      case "stats": {
        const watchedShows = getTvWatched();
        const totalShows = watchedShows.length;
        const totalEpisodes = watchedShows.reduce((total, show) => {
          return total + (show.episodes || 0);
        }, 0);
        const totalMinutes = watchedShows.reduce((total, show) => {
          if (show.runtime && show.episodes) {
            const runtimeMatch = show.runtime.match(/(\d+)/);
            if (runtimeMatch) {
              return total + (parseInt(runtimeMatch[1]) * show.episodes);
            }
          }
          return total;
        }, 0);
        const totalHours = totalMinutes / 60;

        // Count genres
        const genreCounts: { [key: string]: number } = {};
        watchedShows.forEach((show) => {
          if (show.genres) {
            show.genres.split(", ").forEach((genre) => {
              genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
          }
        });

        const topGenres = Object.entries(genreCounts)
          .map(([genre, count]) => ({ genre, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        return NextResponse.json({
          showsWatched: totalShows,
          episodesWatched: totalEpisodes,
          timeWatchedHours: totalHours,
          topGenres,
        });
      }

      case "favorites": {
        if (!type) {
          return NextResponse.json(
            {
              error:
                "Missing 'type' parameter. Valid types: actors, characters, networks, showrunners, shows",
            },
            { status: 400 }
          );
        }

        switch (type) {
          case "actors": {
            const actors = getFavTvActors();
            return NextResponse.json(actors.map(a => ({
              id: a.id,
              name: a.name,
              image: a.image,
            })));
          }
          case "characters": {
            const characters = getFavTvCharacters();
            return NextResponse.json(characters.map(c => ({
              id: c.id,
              name: c.name,
              image: c.image,
              actor: c.actor,
              show: c.show,
            })));
          }
          case "networks": {
            const networks = getFavTvNetworks();
            return NextResponse.json(networks.map(n => ({
              id: n.id,
              name: n.name,
              image: n.image,
              description: n.description,
            })));
          }
          case "showrunners": {
            const showrunners = getFavShowrunners();
            return NextResponse.json(showrunners.map(s => ({
              id: s.id,
              name: s.name,
              image: s.image,
            })));
          }
          case "shows": {
            const shows = getFavTvShows();
            return NextResponse.json(shows.map(s => ({
              id: s.id,
              title: s.name,
              year: s.year ? parseInt(s.year) : null,
              posterUrl: s.poster,
            })));
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
    console.error("Error in TV API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
