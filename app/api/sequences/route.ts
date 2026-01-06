/**
 * =============================================================================
 * Sequences API Route
 * =============================================================================
 *
 * Returns all active sequences.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { NextResponse } from 'next/server';
import { getSequencesData } from '@/lib/data';

// =============================================================================
// GET Handler
// =============================================================================

export async function GET() {
  try {
    const data = await getSequencesData();
    const activeSequences = data.sequences.filter(sequence => sequence.state === "active");
    return NextResponse.json({ sequences: activeSequences });
  } catch (error) {
    console.error('Error fetching sequences:', error);
    return NextResponse.json({ error: 'Failed to fetch sequences' }, { status: 500 });
  }
}
