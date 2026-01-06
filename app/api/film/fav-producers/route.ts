/**
 * ============================================================================
 * Favorite Producers API Route
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Filename: route.ts
 * Description: API endpoint for retrieving favorite producers from media.db.
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getFavProducers } from "@/lib/media-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = getFavProducers();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching favorite producers:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorite producers" },
      { status: 500 }
    );
  }
}
