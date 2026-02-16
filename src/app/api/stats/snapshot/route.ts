/**
 * @type api
 * @path src/app/api/stats/snapshot/route.ts
 *
 * Creates monthly analytics snapshots by pulling Seline data
 * and storing it in Neon history tables.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createSnapshot } from '@/lib/analytics-db'
import { getVisitorData, getVisitMetrics, getStats } from '@/lib/seline'

export async function POST(request: NextRequest) {
  try {
    const { year, month } = await request.json()

    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json({ error: 'Invalid year or month' }, { status: 400 })
    }

    // Calculate date range for the month
    const periodStart = `${year}-${String(month).padStart(2, '0')}-01`
    const lastDay = new Date(year, month, 0).getDate()
    const periodEnd = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

    // Don't allow snapshots for future months
    const now = new Date()
    const endDate = new Date(periodEnd)
    if (endDate > now) {
      return NextResponse.json({ error: 'Cannot snapshot a future or incomplete month' }, { status: 400 })
    }

    const range = { from: `${periodStart}T00:00:00Z`, to: `${periodEnd}T23:59:59Z` }

    // Fetch all data from Seline for this month
    const [visitorData, visitMetrics, referrers, countries, cities, browsers, devices, os] = await Promise.all([
      getVisitorData({ range }).catch(() => null),
      getVisitMetrics({ range }).catch(() => null),
      getStats('referrer', { range, limit: 50 }).catch(() => ({ data: [], total: 0 })),
      getStats('country', { range, limit: 50 }).catch(() => ({ data: [], total: 0 })),
      getStats('city', { range, limit: 50 }).catch(() => ({ data: [], total: 0 })),
      getStats('browser', { range, limit: 50 }).catch(() => ({ data: [], total: 0 })),
      getStats('device', { range, limit: 50 }).catch(() => ({ data: [], total: 0 })),
      getStats('os', { range, limit: 50 }).catch(() => ({ data: [], total: 0 })),
    ])

    const snapshot = await createSnapshot({
      periodStart,
      periodEnd,
      totalVisitors: visitorData?.totalVisitors ?? 0,
      totalViews: visitorData?.totalViews ?? 0,
      avgDurationSeconds: visitMetrics ? parseInt(visitMetrics.duration.value) || 0 : 0,
      bounceRate: visitMetrics ? parseFloat(visitMetrics.bounceRate.value) || 0 : 0,
      referrers: referrers.data.map(r => ({ referrer: r.type || 'Direct', visitors: r.visitors })),
      countries: countries.data.map(r => ({ country: r.type, visitors: r.visitors })),
      cities: cities.data.map(r => ({ city: r.type, country: r.country || '', visitors: r.visitors })),
      browsers: browsers.data.map(r => ({ browser: r.type, visitors: r.visitors })),
      devices: devices.data.map(r => ({ device: r.type, visitors: r.visitors })),
      os: os.data.map(r => ({ os: r.type, visitors: r.visitors })),
    })

    return NextResponse.json({ snapshot })
  } catch (error) {
    console.error('Error creating snapshot:', error)
    return NextResponse.json({ error: 'Failed to create snapshot' }, { status: 500 })
  }
}
