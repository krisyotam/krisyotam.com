/**
 * ============================================================================
 * Locations API Route
 * ============================================================================
 * Author: Kris Yotam
 * Description: API endpoint for fetching location data from system.db
 * Created: 2026-01-05
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getAllLocations } from "@/lib/system-db";

// ============================================================================
// GET Handler
// ============================================================================

export async function GET() {
  try {
    const locations = getAllLocations();
    return NextResponse.json({ locations });
  } catch (err) {
    console.error("Error fetching locations:", err);
    return NextResponse.json({ locations: [] }, { status: 500 });
  }
}
