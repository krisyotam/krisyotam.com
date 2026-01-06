/**
 * ============================================================================
 * Watched Films API Route
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Filename: route.ts
 * Description: API endpoint for retrieving watched films from media.db.
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getWatchedFilms } from "@/lib/media-db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "0");

    const watchedFilms = getWatchedFilms();

    // Transform the data to match the expected format for TraktMovieCard
    const transformedMovies = watchedFilms.map((film) => ({
      id: film.id.toString(),
      title: film.name,
      year: parseInt(film.year) || 0,
      posterUrl: film.poster,
      genres: film.genres,
    }));

    // Apply limit if specified
    const result = limit > 0 ? transformedMovies.slice(0, limit) : transformedMovies;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching watched movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch watched movies" },
      { status: 500 }
    );
  }
}
