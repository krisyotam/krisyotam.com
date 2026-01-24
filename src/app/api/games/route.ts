/**
 * ============================================================================
 * Unified Games API Route
 * ============================================================================
 * Author: Kris Yotam
 * Date: 2026-01-24
 *
 * Consolidates all games-related endpoints into a single route.
 *
 * Usage:
 *   GET /api/games?resource=games          → All games
 *   GET /api/games?resource=games&favorites=true → Favorite games only
 *   GET /api/games?resource=characters     → Game characters
 *   GET /api/games?resource=consoles       → Game consoles
 *   GET /api/games?resource=consoles&manufacturer=Nintendo → Filter by manufacturer
 *   GET /api/games?resource=platforms      → Game platforms
 *
 * @type api
 * @path src/app/api/games/route.ts
 * ============================================================================
 */

import { NextResponse } from "next/server";
import {
  getGames,
  getFavoriteGames,
  getGameCharacters,
  getGameConsoles,
  getGameConsolesByManufacturer,
  getGamePlatforms,
} from "@/lib/media-db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get("resource") || "games";
    const favorites = searchParams.get("favorites") === "true";
    const manufacturer = searchParams.get("manufacturer");

    switch (resource) {
      case "games": {
        const games = favorites ? getFavoriteGames() : getGames();
        const transformed = games.map((game) => ({
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
        return NextResponse.json(transformed);
      }

      case "characters": {
        const characters = getGameCharacters();
        const transformed = characters.map((char) => ({
          id: char.id.toString(),
          name: char.name,
          game: char.game,
          role: char.role,
          avatarImage: char.avatar_image,
          description: char.description,
        }));
        return NextResponse.json(transformed);
      }

      case "consoles": {
        const consoles = manufacturer
          ? getGameConsolesByManufacturer(manufacturer)
          : getGameConsoles();
        const transformed = consoles.map((console) => ({
          id: console.id.toString(),
          name: console.name,
          manufacturer: console.manufacturer,
          releaseDate: console.release_date,
          coverImage: console.cover_image,
        }));
        return NextResponse.json(transformed);
      }

      case "platforms": {
        const platforms = getGamePlatforms();
        const transformed = platforms.map((platform) => ({
          id: platform.id.toString(),
          name: platform.name,
          company: platform.company,
          releaseDate: platform.release_date,
          coverImage: platform.cover_image,
          description: platform.description,
        }));
        return NextResponse.json(transformed);
      }

      default:
        return NextResponse.json(
          { error: `Unknown resource: ${resource}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error fetching games data:", error);
    return NextResponse.json(
      { error: "Failed to fetch games data" },
      { status: 500 }
    );
  }
}
