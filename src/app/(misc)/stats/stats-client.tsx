"use client"

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from "next-themes"
import { PageHeader, PageHeaderProps, PageDescription } from '@/components/core'
import { Box } from "@/components/typography/box"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DataResponse, StatsResponse, VisitMetrics, StatsItem } from '@/lib/seline'
import type { HistorySnapshot, FullSnapshot } from '@/lib/analytics-db'
import {
  TrendingUp,
  TrendingDown,
  Globe,
  MapPin,
  Monitor,
  Smartphone,
  Chrome,
  Share2,
  Calendar,
  Loader2,
} from 'lucide-react'

// =============================================================================
// Lazy-loaded Recharts components
// =============================================================================

const VisitorAreaChart = dynamic(
  () => import('recharts').then(mod => {
    const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } = mod
    return function Chart({ data, isDark }: { data: any[]; isDark: boolean }) {
      const textColor = isDark ? "#A1A1AA" : "#71717A"
      const gridColor = isDark ? "#27272A" : "#E4E4E7"

      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: textColor, fontSize: 11 }}
              tickFormatter={(date) => {
                const d = new Date(date)
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }}
              axisLine={{ stroke: gridColor }}
              tickLine={false}
            />
            <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#18181B" : "#FFFFFF",
                borderColor: isDark ? "#27272A" : "#E4E4E7",
                borderRadius: 0,
                fontSize: 12
              }}
              labelFormatter={(date) => new Date(date).toLocaleDateString("en-US", {
                weekday: 'short', month: "short", day: "numeric"
              })}
            />
            <Legend />
            <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#14B8A6" strokeWidth={2} fill="url(#colorVisitors)" />
            <Area type="monotone" dataKey="views" name="Page Views" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorViews)" />
          </AreaChart>
        </ResponsiveContainer>
      )
    }
  }),
  { ssr: false, loading: () => <div className="h-[300px] bg-muted/50 animate-pulse" /> }
)

const HorizontalBarChart = dynamic(
  () => import('recharts').then(mod => {
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = mod
    return function Chart({ data, dataKey, nameKey, isDark, color }: { data: any[]; dataKey: string; nameKey: string; isDark: boolean; color: string }) {
      const textColor = isDark ? "#A1A1AA" : "#71717A"
      const gridColor = isDark ? "#27272A" : "#E4E4E7"

      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey={nameKey} tick={{ fill: textColor, fontSize: 11 }} width={120} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#18181B" : "#FFFFFF",
                borderColor: isDark ? "#27272A" : "#E4E4E7",
                borderRadius: 0,
                fontSize: 12
              }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    }
  }),
  { ssr: false, loading: () => <div className="h-[300px] bg-muted/50 animate-pulse" /> }
)

const PieChartComponent = dynamic(
  () => import('recharts').then(mod => {
    const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } = mod
    const COLORS = ['#14B8A6', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#10B981', '#6366F1']
    return function Chart({ data, isDark }: { data: { name: string; value: number }[]; isDark: boolean }) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#18181B" : "#FFFFFF",
                borderColor: isDark ? "#27272A" : "#E4E4E7",
                borderRadius: 0,
                fontSize: 12
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )
    }
  }),
  { ssr: false, loading: () => <div className="h-[300px] bg-muted/50 animate-pulse" /> }
)

// =============================================================================
// Types & Constants
// =============================================================================

interface StatsClientProps {
  stats: {
    visitorData: DataResponse | null
    visitMetrics: VisitMetrics | null
    referrers: StatsResponse
    countries: StatsResponse
    cities: StatsResponse
    browsers: StatsResponse
    devices: StatsResponse
    operatingSystems: StatsResponse
  }
  snapshots: HistorySnapshot[]
}

type PageTab = 'digest' | 'charts' | 'history'
type DigestTab = 'referrers' | 'countries' | 'cities' | 'browsers' | 'devices' | 'os'

const PAGE_TABS: { id: PageTab; label: string }[] = [
  { id: 'digest', label: 'Digest' },
  { id: 'charts', label: 'Charts' },
  { id: 'history', label: 'History' },
]

const DIGEST_TABS: { id: DigestTab; label: string; icon: React.ReactNode }[] = [
  { id: 'referrers', label: 'Referrers', icon: <Share2 className="w-4 h-4" /> },
  { id: 'countries', label: 'Countries', icon: <Globe className="w-4 h-4" /> },
  { id: 'cities', label: 'Cities', icon: <MapPin className="w-4 h-4" /> },
  { id: 'browsers', label: 'Browsers', icon: <Chrome className="w-4 h-4" /> },
  { id: 'devices', label: 'Devices', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'os', label: 'OS', icon: <Monitor className="w-4 h-4" /> },
]

const CHART_PERIODS = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '6m', label: '6 Months' },
  { id: '12m', label: '12 Months' },
] as const

// =============================================================================
// Helper Functions
// =============================================================================

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}

function TrendIndicator({ trend, invert = false }: { trend?: number; invert?: boolean }) {
  if (trend === undefined || trend === 0) return null
  const isPositive = invert ? trend < 0 : trend > 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${
      isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
    }`}>
      {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
      {Math.abs(trend)}%
    </span>
  )
}

function getCountryFlag(code: string): string {
  if (!code || code.length !== 2) return ''
  const codePoints = code.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

function formatMonth(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { year: 'numeric', month: 'long' })
}

// =============================================================================
// Digest Tab
// =============================================================================

function DigestContent({ stats, isDark }: {
  stats: StatsClientProps['stats']
  isDark: boolean
}) {
  const [activeTab, setActiveTab] = useState<DigestTab>('referrers')
  const { visitorData, visitMetrics, referrers, countries, cities, browsers, devices, operatingSystems } = stats

  const getTabData = (): StatsItem[] => {
    switch (activeTab) {
      case 'referrers': return referrers.data
      case 'countries': return countries.data
      case 'cities': return cities.data
      case 'browsers': return browsers.data
      case 'devices': return devices.data
      case 'os': return operatingSystems.data
      default: return []
    }
  }

  const getColumnHeader = (): string => {
    switch (activeTab) {
      case 'referrers': return 'Source'
      case 'countries': return 'Country'
      case 'cities': return 'City'
      case 'browsers': return 'Browser'
      case 'devices': return 'Device'
      case 'os': return 'Operating System'
      default: return 'Item'
    }
  }

  const formatValue = (item: StatsItem): string => {
    if (activeTab === 'countries') return `${getCountryFlag(item.type)} ${item.type}`
    if (activeTab === 'cities') return `${item.type}${item.country ? `, ${item.country}` : ''}`
    if (activeTab === 'referrers' && !item.type) return 'Direct / None'
    return item.type || 'Unknown'
  }

  return (
    <>
      {/* Metrics Strip */}
      <div className="my-6 border border-border bg-muted/30 dark:bg-[hsl(var(--popover))]">
        <div className="px-4 py-2.5 border-b border-border bg-muted/50 dark:bg-muted/20">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            30-Day Overview
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          <div className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
              {visitorData?.totalVisitors?.toLocaleString() ?? '0'}
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-xs text-muted-foreground">visitors</span>
              <TrendIndicator trend={visitorData?.trendVisitors} />
            </div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
              {visitorData?.totalViews?.toLocaleString() ?? '0'}
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-xs text-muted-foreground">views</span>
              <TrendIndicator trend={visitorData?.trendViews} />
            </div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
              {visitMetrics ? formatDuration(parseInt(visitMetrics.duration.value)) : '0s'}
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-xs text-muted-foreground">avg. duration</span>
              <TrendIndicator trend={visitMetrics?.duration.trend} />
            </div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
              {visitMetrics?.bounceRate.value ?? '0'}%
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-xs text-muted-foreground">bounce rate</span>
              <TrendIndicator trend={visitMetrics?.bounceRate.trend} invert />
            </div>
          </div>
        </div>
      </div>

      {/* Visitor Chart */}
      <Box className="my-6">
        <h3 className="text-lg font-medium mb-4">Visitor Trends</h3>
        <div className="h-[300px]">
          {visitorData?.data && visitorData.data.length > 0 ? (
            <VisitorAreaChart data={visitorData.data} isDark={isDark} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No visitor data available
            </div>
          )}
        </div>
      </Box>

      {/* Digest Sub-tabs */}
      <Box className="p-0 my-6">
        <div className="flex overflow-x-auto border-b border-border">
          {DIGEST_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </Box>

      {/* Stats Table */}
      <Box>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70%]">{getColumnHeader()}</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getTabData().length > 0 ? (
              getTabData().map((item, index) => (
                <TableRow key={`${item.type}-${index}`}>
                  <TableCell className="font-medium">{formatValue(item)}</TableCell>
                  <TableCell className="text-right">{item.visitors.toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </>
  )
}

// =============================================================================
// Charts Tab
// =============================================================================

function ChartsContent({ initialStats, isDark }: {
  initialStats: StatsClientProps['stats']
  isDark: boolean
}) {
  const [period, setPeriod] = useState<string>('30d')
  const [stats, setStats] = useState(initialStats)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async (p: string) => {
    if (p === '30d') {
      setStats(initialStats)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/stats/charts?period=${p}`)
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Failed to fetch chart data:', err)
    } finally {
      setLoading(false)
    }
  }, [initialStats])

  useEffect(() => {
    fetchData(period)
  }, [period, fetchData])

  const { visitorData, referrers, countries, browsers, devices, operatingSystems } = stats

  const referrerData = referrers.data.map(r => ({
    name: r.type || 'Direct',
    visitors: r.visitors,
  }))

  const countryData = countries.data.map(r => ({
    name: `${getCountryFlag(r.type)} ${r.type}`,
    visitors: r.visitors,
  }))

  const browserData = browsers.data.map(r => ({
    name: r.type || 'Unknown',
    visitors: r.visitors,
  }))

  const deviceData = devices.data.map(r => ({
    name: r.type || 'Unknown',
    value: r.visitors,
  }))

  const osData = operatingSystems.data.map(r => ({
    name: r.type || 'Unknown',
    visitors: r.visitors,
  }))

  return (
    <>
      {/* Period Selector */}
      <div className="my-6 flex items-center gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wide mr-2">Period:</span>
        {CHART_PERIODS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
              period === p.id
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground'
            }`}
          >
            {p.label}
          </button>
        ))}
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-2" />}
      </div>

      {/* Visitors & Views Over Time */}
      <Box className="my-6">
        <h3 className="text-lg font-medium mb-4">Visitors & Page Views</h3>
        <div className="h-[300px]">
          {visitorData?.data && visitorData.data.length > 0 ? (
            <VisitorAreaChart data={visitorData.data} isDark={isDark} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available for this period
            </div>
          )}
        </div>
      </Box>

      {/* Top Referrers */}
      {referrerData.length > 0 && (
        <Box className="my-6">
          <h3 className="text-lg font-medium mb-4">Top Referrers</h3>
          <div className="h-[300px]">
            <HorizontalBarChart data={referrerData} dataKey="visitors" nameKey="name" isDark={isDark} color="#14B8A6" />
          </div>
        </Box>
      )}

      {/* Countries */}
      {countryData.length > 0 && (
        <Box className="my-6">
          <h3 className="text-lg font-medium mb-4">Countries</h3>
          <div className="h-[300px]">
            <HorizontalBarChart data={countryData} dataKey="visitors" nameKey="name" isDark={isDark} color="#8B5CF6" />
          </div>
        </Box>
      )}

      {/* Devices (Pie Chart) */}
      {deviceData.length > 0 && (
        <Box className="my-6">
          <h3 className="text-lg font-medium mb-4">Devices</h3>
          <div className="h-[300px]">
            <PieChartComponent data={deviceData} isDark={isDark} />
          </div>
        </Box>
      )}

      {/* Browsers */}
      {browserData.length > 0 && (
        <Box className="my-6">
          <h3 className="text-lg font-medium mb-4">Browsers</h3>
          <div className="h-[300px]">
            <HorizontalBarChart data={browserData} dataKey="visitors" nameKey="name" isDark={isDark} color="#F59E0B" />
          </div>
        </Box>
      )}

      {/* Operating Systems */}
      {osData.length > 0 && (
        <Box className="my-6">
          <h3 className="text-lg font-medium mb-4">Operating Systems</h3>
          <div className="h-[300px]">
            <HorizontalBarChart data={osData} dataKey="visitors" nameKey="name" isDark={isDark} color="#3B82F6" />
          </div>
        </Box>
      )}
    </>
  )
}

// =============================================================================
// History Tab
// =============================================================================

function HistoryContent({ snapshots }: { snapshots: HistorySnapshot[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(snapshots[0]?.id ?? null)
  const [snapshot, setSnapshot] = useState<FullSnapshot | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedId) return
    setLoading(true)
    fetch(`/api/stats/history?id=${selectedId}`)
      .then(res => res.json())
      .then(data => setSnapshot(data))
      .catch(err => console.error('Failed to load snapshot:', err))
      .finally(() => setLoading(false))
  }, [selectedId])

  if (snapshots.length === 0) {
    return (
      <div className="my-6 border border-border p-8 text-center">
        <Calendar className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">No historical snapshots yet.</p>
        <p className="text-xs text-muted-foreground mt-1">
          Snapshots are created monthly to archive analytics data.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Month Picker */}
      <div className="my-6 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground uppercase tracking-wide mr-2">Month:</span>
        {snapshots.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedId(s.id)}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
              selectedId === s.id
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground'
            }`}
          >
            {formatMonth(s.period_start)}
          </button>
        ))}
      </div>

      {loading && (
        <div className="my-6 flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {snapshot && !loading && (
        <>
          {/* Summary Card */}
          <div className="my-6 border border-border bg-muted/30 dark:bg-[hsl(var(--popover))]">
            <div className="px-4 py-2.5 border-b border-border bg-muted/50 dark:bg-muted/20">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {formatMonth(snapshot.period_start)} Summary
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
              <div className="p-4 text-center">
                <div className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
                  {snapshot.total_visitors.toLocaleString()}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">visitors</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
                  {snapshot.total_views.toLocaleString()}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">views</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
                  {formatDuration(snapshot.avg_duration_seconds)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">avg. duration</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
                  {snapshot.bounce_rate}%
                </div>
                <div className="mt-1 text-xs text-muted-foreground">bounce rate</div>
              </div>
            </div>
          </div>

          {/* Dimension Tables */}
          {snapshot.referrers.length > 0 && (
            <HistoryTable title="Referrers" items={snapshot.referrers.map(r => ({ label: r.referrer || 'Direct', visitors: r.visitors }))} />
          )}
          {snapshot.countries.length > 0 && (
            <HistoryTable title="Countries" items={snapshot.countries.map(r => ({ label: `${getCountryFlag(r.country)} ${r.country}`, visitors: r.visitors }))} />
          )}
          {snapshot.cities.length > 0 && (
            <HistoryTable title="Cities" items={snapshot.cities.map(r => ({ label: `${r.city}${r.country ? `, ${r.country}` : ''}`, visitors: r.visitors }))} />
          )}
          {snapshot.browsers.length > 0 && (
            <HistoryTable title="Browsers" items={snapshot.browsers.map(r => ({ label: r.browser, visitors: r.visitors }))} />
          )}
          {snapshot.devices.length > 0 && (
            <HistoryTable title="Devices" items={snapshot.devices.map(r => ({ label: r.device, visitors: r.visitors }))} />
          )}
          {snapshot.os.length > 0 && (
            <HistoryTable title="Operating Systems" items={snapshot.os.map(r => ({ label: r.os, visitors: r.visitors }))} />
          )}
        </>
      )}
    </>
  )
}

function HistoryTable({ title, items }: { title: string; items: { label: string; visitors: number }[] }) {
  return (
    <Box className="my-6">
      <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[70%]">{title}</TableHead>
            <TableHead className="text-right">Visitors</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{item.label}</TableCell>
              <TableCell className="text-right">{item.visitors.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export default function StatsClient({ stats, snapshots }: StatsClientProps) {
  const [activeTab, setActiveTab] = useState<PageTab>('digest')
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const headerData: PageHeaderProps = {
    title: "Statistics",
    preview: "Live updating stats page listing krisyotam.com traffic statistics, referrer details, sourced from Seline Analytics (Nov. 2025-Present).",
    status: "Published" as const,
    confidence: "certain" as const,
    importance: 7,
    start_date: "2025-01-01",
    end_date: new Date().toISOString().split('T')[0],
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <PageHeader {...headerData} />

      {/* Top-level Tabs */}
      <div className="relative mt-6">
        <div className="flex border-b border-border">
          {PAGE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium relative transition-colors ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'digest' && <DigestContent stats={stats} isDark={isDark} />}
      {activeTab === 'charts' && <ChartsContent initialStats={stats} isDark={isDark} />}
      {activeTab === 'history' && <HistoryContent snapshots={snapshots} />}

      <PageDescription
        title="About Statistics"
        description="Real-time visitor analytics powered by Seline. Data shows the last 30 days of activity including traffic sources, geographic distribution, and visitor behavior metrics. Historical snapshots are archived monthly."
      />
    </div>
  )
}
