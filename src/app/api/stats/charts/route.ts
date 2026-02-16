/**
 * @type api
 * @path src/app/api/stats/charts/route.ts
 *
 * Fetches Seline analytics data for the Charts tab with configurable period.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAllStats } from '@/lib/seline'

const VALID_PERIODS = ['7d', '30d', '6m', '12m', 'all_time'] as const

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    if (!VALID_PERIODS.includes(period as typeof VALID_PERIODS[number])) {
      return NextResponse.json({ error: 'Invalid period' }, { status: 400 })
    }

    const stats = await getAllStats(period as typeof VALID_PERIODS[number])
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching chart data:', error)
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 })
  }
}
