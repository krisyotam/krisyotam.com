/**
 * ============================================================================
 * Game Characters API Route
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Filename: route.ts
 * Description: API endpoint for retrieving game characters from media.db.
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getGameCharacters } from "@/lib/media-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const characters = getGameCharacters();

    // Transform to camelCase for client
    const transformedCharacters = characters.map((char) => ({
      id: char.id.toString(),
      name: char.name,
      game: char.game,
      role: char.role,
      avatarImage: char.avatar_image,
      description: char.description,
    }));

    return NextResponse.json(transformedCharacters);
  } catch (error) {
    console.error("Error fetching game characters:", error);
    return NextResponse.json(
      { error: "Failed to fetch game characters" },
      { status: 500 }
    );
  }
}
