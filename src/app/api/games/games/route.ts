/**
 * ============================================================================
 * Games API Route
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Filename: route.ts
 * Description: API endpoint for retrieving games from media.db.
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getGames, getFavoriteGames } from "@/lib/media-db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const favoritesOnly = searchParams.get("favorites") === "true";

    const games = favoritesOnly ? getFavoriteGames() : getGames();

    // Transform to camelCase for client
    const transformedGames = games.map((game) => ({
      id: game.id.toString(),
      name: game.name,
      version: game.version,
      releaseDate: game.release_date,
      console: game.console,
      hoursPlayed: game.hours_played,
      genre: game.genres,
      coverImage: game.cover_image,
      developer: game.developer,
      publisher: game.publisher,
      rating: game.rating,
      favorite: game.favorite,
      favoriteWeight: game.favorite_weight,
      dateLastPlayed: game.date_last_played,
    }));

    return NextResponse.json(transformedGames);
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
