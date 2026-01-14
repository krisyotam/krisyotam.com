/**
 * =============================================================================
 * Fiction API Route
 * =============================================================================
 *
 * Returns all fiction content.
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
    const fiction = getContentByType('fiction');
    return NextResponse.json(fiction);
  } catch (error) {
    console.error('Error fetching fiction:', error);
    return NextResponse.json({ error: 'Failed to fetch fiction' }, { status: 500 });
  }
}
