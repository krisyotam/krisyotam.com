"use client"

import { useState } from 'react'
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
import {
  TrendingUp,
  TrendingDown,
  Globe,
  MapPin,
  Monitor,
  Smartphone,
  Chrome,
  Share2
} from 'lucide-react'

// Lazy load chart components
const AreaChart = dynamic(
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
            <YAxis
              tick={{ fill: textColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#18181B" : "#FFFFFF",
                borderColor: isDark ? "#27272A" : "#E4E4E7",
                borderRadius: 8,
                fontSize: 12
              }}
              labelFormatter={(date) => new Date(date).toLocaleDateString("en-US", {
                weekday: 'short',
                month: "short",
                day: "numeric"
              })}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="visitors"
              name="Visitors"
              stroke="#14B8A6"
              strokeWidth={2}
              fill="url(#colorVisitors)"
            />
            <Area
              type="monotone"
              dataKey="views"
              name="Page Views"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#colorViews)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )
    }
  }),
  { ssr: false, loading: () => <div className="h-[300px] bg-muted/50 animate-pulse rounded" /> }
)

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
}

type TabType = 'referrers' | 'countries' | 'cities' | 'browsers' | 'devices' | 'os'

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'referrers', label: 'Referrers', icon: <Share2 className="w-4 h-4" /> },
  { id: 'countries', label: 'Countries', icon: <Globe className="w-4 h-4" /> },
  { id: 'cities', label: 'Cities', icon: <MapPin className="w-4 h-4" /> },
  { id: 'browsers', label: 'Browsers', icon: <Chrome className="w-4 h-4" /> },
  { id: 'devices', label: 'Devices', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'os', label: 'OS', icon: <Monitor className="w-4 h-4" /> },
]

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
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export default function StatsClient({ stats }: StatsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('referrers')
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const { visitorData, visitMetrics, referrers, countries, cities, browsers, devices, operatingSystems } = stats

  // Header data
  const headerData: PageHeaderProps = {
    title: "Statistics",
    preview: "Live updating stats page listing krisyotam.com traffic statistics, referrer details, sourced from Seline Analytics (Nov. 2025-Present).",
    status: "Published" as const,
    confidence: "certain" as const,
    importance: 7,
    start_date: "2025-01-01",
    end_date: new Date().toISOString().split('T')[0],
  }

  // Get data for current tab
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
    if (activeTab === 'countries') {
      return `${getCountryFlag(item.type)} ${item.type}`
    }
    if (activeTab === 'cities') {
      return `${item.type}${item.country ? `, ${item.country}` : ''}`
    }
    if (activeTab === 'referrers' && !item.type) {
      return 'Direct / None'
    }
    return item.type || 'Unknown'
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <PageHeader {...headerData} />

      {/* Unified Bento Metrics Strip */}
      <div className="my-6 border border-border bg-muted/30 dark:bg-[hsl(var(--popover))]">
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-border bg-muted/50 dark:bg-muted/20">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            30-Day Overview
          </span>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {/* Visitors */}
          <div className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
              {visitorData?.totalVisitors?.toLocaleString() ?? '0'}
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-xs text-muted-foreground">visitors</span>
              <TrendIndicator trend={visitorData?.trendVisitors} />
            </div>
          </div>

          {/* Page Views */}
          <div className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
              {visitorData?.totalViews?.toLocaleString() ?? '0'}
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-xs text-muted-foreground">views</span>
              <TrendIndicator trend={visitorData?.trendViews} />
            </div>
          </div>

          {/* Avg Duration */}
          <div className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
              {visitMetrics ? formatDuration(parseInt(visitMetrics.duration.value)) : '0s'}
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-xs text-muted-foreground">avg. duration</span>
              <TrendIndicator trend={visitMetrics?.duration.trend} />
            </div>
          </div>

          {/* Bounce Rate */}
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
            <AreaChart data={visitorData.data} isDark={isDark} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No visitor data available
            </div>
          )}
        </div>
      </Box>

      {/* Stats Tabs */}
      <Box className="p-0 my-6">
        <div className="flex overflow-x-auto border-b border-border">
          {tabs.map((tab) => (
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

      <PageDescription
        title="About Statistics"
        description="Real-time visitor analytics powered by Seline. Data shows the last 30 days of activity including traffic sources, geographic distribution, and visitor behavior metrics."
      />
    </div>
  )
}
