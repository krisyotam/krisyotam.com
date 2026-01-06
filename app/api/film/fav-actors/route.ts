/**
 * ============================================================================
 * Favorite Actors API Route
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Filename: route.ts
 * Description: API endpoint for retrieving favorite actors from media.db.
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getFavActors } from "@/lib/media-db";

export async function GET() {
  try {
    const data = getFavActors();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching favorite actors:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorite actors" },
      { status: 500 }
    );
  }
}
