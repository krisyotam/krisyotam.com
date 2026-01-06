/**
 * ============================================================================
 * Watched Stats API Route
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Filename: route.ts
 * Description: API endpoint for film watching statistics from media.db.
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getWatchedFilms } from "@/lib/media-db";

export async function GET() {
  try {
    const watchedMovies = getWatchedFilms();

    // Calculate total movies
    const totalMovies = watchedMovies.length;

    // Calculate total hours from runtime
    const totalMinutes = watchedMovies.reduce((total, movie) => {
      if (movie.runtime) {
        // Parse runtime string like "115 mins" to get the number
        const runtimeMatch = movie.runtime.match(/(\d+)/);
        if (runtimeMatch) {
          return total + parseInt(runtimeMatch[1]);
        }
      }
      return total;
    }, 0);

    const totalHours = totalMinutes / 60;

    // Filter movies watched this year
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
      tvShowsWatched: moviesThisYear, // Using "Watched This Year" count
      timeWatchedHours: totalHours,
    });
  } catch (error) {
    console.error("Error calculating watched stats:", error);
    return NextResponse.json(
      { error: "Failed to calculate watched stats" },
      { status: 500 }
    );
  }
}
