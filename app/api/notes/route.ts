/**
 * =============================================================================
 * Notes API Route
 * =============================================================================
 *
 * Returns all notes content.
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
    const notes = getContentByType('notes');
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}
