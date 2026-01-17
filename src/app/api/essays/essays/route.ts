/**
 * =============================================================================
 * Essays API Route
 * =============================================================================
 *
 * Returns all essays content.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { NextResponse } from "next/server";
import { getContentByType } from "@/lib/data";

// =============================================================================
// GET Handler
// =============================================================================

export async function GET() {
  try {
    const essays = getContentByType('essays');
    return NextResponse.json({ essays });
  } catch (error) {
    console.error('Error fetching essays:', error);
    return NextResponse.json({ error: 'Failed to fetch essays' }, { status: 500 });
  }
}
