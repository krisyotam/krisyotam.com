/**
 * ============================================================================
 * Favorite Directors API Route
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Filename: route.ts
 * Description: API endpoint for retrieving favorite directors from media.db.
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getFavDirectors } from "@/lib/media-db";

export async function GET() {
  try {
    const data = getFavDirectors();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching favorite directors:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorite directors" },
      { status: 500 }
    );
  }
}
