/**
 * ============================================================================
 * Favorite Film Companies API Route
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Filename: route.ts
 * Description: API endpoint for retrieving favorite film companies from media.db.
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getFavFilmCompanies } from "@/lib/media-db";

export async function GET() {
  try {
    const data = getFavFilmCompanies();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching favorite film companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorite film companies" },
      { status: 500 }
    );
  }
}
