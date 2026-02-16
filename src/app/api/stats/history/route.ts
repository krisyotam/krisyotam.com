/**
 * @type api
 * @path src/app/api/stats/history/route.ts
 *
 * Retrieves historical analytics snapshots from Neon.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSnapshots, getSnapshotById } from '@/lib/analytics-db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const snapshot = await getSnapshotById(parseInt(id))
      if (!snapshot) {
        return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 })
      }
      return NextResponse.json(snapshot)
    }

    const snapshots = await getSnapshots()
    return NextResponse.json({ snapshots })
  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
