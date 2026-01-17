/**
 * ============================================================================
 * Game Platforms API Route
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Filename: route.ts
 * Description: API endpoint for retrieving game platforms from media.db.
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getGamePlatforms } from "@/lib/media-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const platforms = getGamePlatforms();

    // Transform to camelCase for client
    const transformedPlatforms = platforms.map((platform) => ({
      id: platform.id.toString(),
      name: platform.name,
      company: platform.company,
      releaseDate: platform.release_date,
      coverImage: platform.cover_image,
      description: platform.description,
    }));

    return NextResponse.json(transformedPlatforms);
  } catch (error) {
    console.error("Error fetching game platforms:", error);
    return NextResponse.json(
      { error: "Failed to fetch game platforms" },
      { status: 500 }
    );
  }
}
