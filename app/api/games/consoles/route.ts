/**
 * ============================================================================
 * Game Consoles API Route
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Filename: route.ts
 * Description: API endpoint for retrieving game consoles from media.db.
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getGameConsoles, getGameConsolesByManufacturer } from "@/lib/media-db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const manufacturer = searchParams.get("manufacturer");

    const consoles = manufacturer
      ? getGameConsolesByManufacturer(manufacturer)
      : getGameConsoles();

    // Transform to camelCase for client
    const transformedConsoles = consoles.map((console) => ({
      id: console.id.toString(),
      name: console.name,
      manufacturer: console.manufacturer,
      releaseDate: console.release_date,
      coverImage: console.cover_image,
    }));

    return NextResponse.json(transformedConsoles);
  } catch (error) {
    console.error("Error fetching game consoles:", error);
    return NextResponse.json(
      { error: "Failed to fetch game consoles" },
      { status: 500 }
    );
  }
}
