"use client"

import { useState, useEffect, useRef } from "react"
import format from "date-fns/format"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { PageHeader, PageDescription } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// =============================================================================
// Types
// =============================================================================

interface HeatmapData {
  date: string
  count: number
}

interface LineChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
  }[]
}

interface Stats {
  completedTests: number
  startedTests: number
  timeTyping: number
}

interface PersonalBest {
  wpm?: number
  acc?: number
  timestamp?: number
}

interface Streak {
  length: number
  maxLength: number
  lastResultTimestamp: number
}

interface TestActivity {
  testsByDays: number[]
}

interface Result {
  timestamp: string
  mode: string
  mode2: string
  isPb: boolean
  wpm: number
  acc: number
  consistency?: number
  testDuration: number
}

// =============================================================================
// Inline Components
// =============================================================================

function CalendarHeatmap({ data }: { data: HeatmapData[] }) {
  const [hoveredDay, setHoveredDay] = useState<HeatmapData | null>(null)

  const maxCount = Math.max(...data.map((d) => d.count), 1)

  const months: { [key: string]: HeatmapData[] } = {}
  data.forEach((day) => {
    const monthKey = day.date.substring(0, 7)
    if (!months[monthKey]) {
      months[monthKey] = []
    }
    months[monthKey].push(day)
  })

  const sortedMonths = Object.keys(months).sort()

  const getColorIntensity = (count: number) => {
    if (count === 0) return "bg-muted"
    const intensity = Math.min(Math.ceil((count / maxCount) * 5), 5)
    return `bg-primary/[0.${intensity * 2}]`
  }

  return (
    <div className="relative">
      {hoveredDay && (
        <div className="absolute top-0 right-0 bg-popover text-popover-foreground text-xs p-2 border border-border shadow-sm">
          <div className="font-medium">{format(new Date(hoveredDay.date), "MMM d, yyyy")}</div>
          <div>{hoveredDay.count} tests</div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {sortedMonths.map((month) => (
          <div key={month} className="flex flex-col">
            <div className="text-xs text-muted-foreground mb-1">{format(new Date(month), "MMM")}</div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: new Date(month + "-01").getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="w-3 h-3"></div>
              ))}
              {months[month].map((day) => (
                <div
                  key={day.date}
                  className={`w-3 h-3 ${getColorIntensity(day.count)}`}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LineChart({ data }: { data: LineChartData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    const { width, height } = canvasRef.current
    const padding = { top: 20, right: 20, bottom: 30, left: 40 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    const dataset = data.datasets[0]
    const values = dataset.data

    const maxValue = Math.max(...values, 1)
    const xScale = chartWidth / (values.length - 1)
    const yScale = chartHeight / maxValue

    // Get computed styles for theme-aware colors
    const computedStyle = getComputedStyle(document.documentElement)
    const mutedColor = computedStyle.getPropertyValue('--muted-foreground').trim() || '#888'
    const borderColor = computedStyle.getPropertyValue('--border').trim() || '#e5e7eb'

    // Draw axes
    ctx.strokeStyle = `hsl(${mutedColor})`
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.moveTo(padding.left, height - padding.bottom)
    ctx.lineTo(width - padding.right, height - padding.bottom)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top)
    ctx.lineTo(padding.left, height - padding.bottom)
    ctx.stroke()

    // Draw grid lines
    ctx.strokeStyle = `hsl(${borderColor})`
    ctx.lineWidth = 0.5

    const yTicks = 5
    for (let i = 0; i <= yTicks; i++) {
      const y = height - padding.bottom - (i * chartHeight) / yTicks
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      ctx.fillStyle = `hsl(${mutedColor})`
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      ctx.fillText(Math.round((i * maxValue) / yTicks).toString(), padding.left - 5, y)
    }

    // Draw line
    ctx.strokeStyle = "hsl(var(--primary))"
    ctx.lineWidth = 2
    ctx.beginPath()

    values.forEach((value, index) => {
      const x = padding.left + index * xScale
      const y = height - padding.bottom - value * yScale

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points
    ctx.fillStyle = "hsl(var(--primary))"
    values.forEach((value, index) => {
      const x = padding.left + index * xScale
      const y = height - padding.bottom - value * yScale

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw x-axis labels
    ctx.fillStyle = `hsl(${mutedColor})`
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    const labelStep = Math.ceil(data.labels.length / 10)
    data.labels.forEach((label, index) => {
      if (index % labelStep === 0 || index === data.labels.length - 1) {
        const x = padding.left + index * xScale
        ctx.fillText(label, x, height - padding.bottom + 5)
      }
    })
  }, [data])

  return <canvas ref={canvasRef} width={800} height={200} className="w-full h-full" />
}

// =============================================================================
// Data Fetching
// =============================================================================

async function fetchStats(): Promise<Stats | null> {
  try {
    const res = await fetch('/api/monkeytype/stats', { next: { revalidate: 300 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function fetchPersonalBests(mode: string, mode2: string): Promise<PersonalBest | null> {
  try {
    const res = await fetch(`/api/monkeytype/personal-bests?mode=${mode}&mode2=${mode2}`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function fetchStreak(): Promise<Streak | null> {
  try {
    const res = await fetch('/api/monkeytype/streak', { next: { revalidate: 300 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function fetchTestActivity(): Promise<TestActivity | null> {
  try {
    const res = await fetch('/api/monkeytype/test-activity', { next: { revalidate: 300 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function fetchResults(limit: number): Promise<Result[] | null> {
  try {
    const res = await fetch(`/api/monkeytype/results?limit=${limit}`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// =============================================================================
// Card Components
// =============================================================================

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-border bg-card text-card-foreground ${className}`}>
      {children}
    </div>
  )
}

function StatItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col items-center p-4 bg-muted/50">
      <div className="text-xl font-medium">{value}</div>
      <div className="text-sm text-muted-foreground font-light">{title}</div>
    </div>
  )
}


// =============================================================================
// Section Components
// =============================================================================

function StatsOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats().then((data) => {
      setStats(data)
      setLoading(false)
    })
  }, [])

  const hasData = stats !== null
  const completedTests = stats?.completedTests ?? 0
  const startedTests = stats?.startedTests ?? 0
  const timeTyping = stats?.timeTyping ?? 0
  const hours = Math.floor(timeTyping / 3600)
  const minutes = Math.floor((timeTyping % 3600) / 60)
  const completionRate = startedTests > 0 ? Math.round((completedTests / startedTests) * 100) : 0

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatItem title="Tests Completed" value={hasData ? completedTests.toLocaleString() : "No data"} />
        <StatItem title="Tests Started" value={hasData ? startedTests.toLocaleString() : "No data"} />
        <StatItem title="Completion Rate" value={hasData ? `${completionRate}%` : "No data"} />
        <StatItem title="Time Typing" value={hasData ? `${hours}h ${minutes}m` : "No data"} />
      </div>
    </Card>
  )
}

function PersonalBestsCard() {
  const modes = [
    { mode: "time", mode2: "15" },
    { mode: "time", mode2: "30" },
    { mode: "time", mode2: "60" },
    { mode: "time", mode2: "120" },
    { mode: "words", mode2: "10" },
    { mode: "words", mode2: "25" },
    { mode: "words", mode2: "50" },
    { mode: "words", mode2: "100" },
  ]

  const [personalBests, setPersonalBests] = useState<{ mode: string; mode2: string; data: PersonalBest | null }[]>(
    modes.map(m => ({ ...m, data: null }))
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all(
      modes.map(async ({ mode, mode2 }) => ({
        mode,
        mode2,
        data: await fetchPersonalBests(mode, mode2),
      }))
    ).then((results) => {
      setPersonalBests(results)
      setLoading(false)
    })
  }, [])

  return (
    <Card className="p-6 h-full">
      <h2 className="text-lg font-medium mb-4">Personal Bests</h2>
      <Tabs defaultValue="time">
        <TabsList className="mb-4">
          <TabsTrigger value="time">Time</TabsTrigger>
          <TabsTrigger value="words">Words</TabsTrigger>
        </TabsList>

        <TabsContent value="time" className="space-y-3">
          {personalBests
            .filter((pb) => pb.mode === "time")
            .map((pb) => (
              <div key={`${pb.mode}-${pb.mode2}`} className="flex justify-between items-center border-b border-border pb-2">
                <div className="font-medium text-sm">{pb.mode2}s</div>
                {pb.data ? (
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-xs">
                      {pb.data.wpm?.toFixed(1) || "0"} WPM
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      {pb.data.acc?.toFixed(1) || "0"}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {pb.data.timestamp ? new Date(pb.data.timestamp).toLocaleDateString() : "—"}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">No data</span>
                )}
              </div>
            ))}
        </TabsContent>

        <TabsContent value="words" className="space-y-3">
          {personalBests
            .filter((pb) => pb.mode === "words")
            .map((pb) => (
              <div key={`${pb.mode}-${pb.mode2}`} className="flex justify-between items-center border-b border-border pb-2">
                <div className="font-medium text-sm">{pb.mode2} words</div>
                {pb.data ? (
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-xs">
                      {pb.data.wpm?.toFixed(1) || "0"} WPM
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      {pb.data.acc?.toFixed(1) || "0"}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {pb.data.timestamp ? new Date(pb.data.timestamp).toLocaleDateString() : "—"}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">No data</span>
                )}
              </div>
            ))}
        </TabsContent>
      </Tabs>
    </Card>
  )
}

function StreakCard() {
  const [streak, setStreak] = useState<Streak | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStreak().then((data) => {
      setStreak(data)
      setLoading(false)
    })
  }, [])

  const hasData = streak !== null

  return (
    <Card className="p-6 h-full">
      <h2 className="text-lg font-medium mb-4">Streak</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center p-6 bg-muted/50">
          <span className="text-3xl font-light">{hasData ? streak.length : "—"}</span>
          <span className="text-xs text-muted-foreground mt-2">Current</span>
        </div>
        <div className="flex flex-col items-center justify-center p-6 bg-muted/50">
          <span className="text-3xl font-light">{hasData ? streak.maxLength : "—"}</span>
          <span className="text-xs text-muted-foreground mt-2">Best</span>
        </div>
      </div>
      <div className="mt-4 text-center text-xs text-muted-foreground">
        {hasData
          ? `Last test: ${formatDistanceToNow(new Date(streak.lastResultTimestamp), { addSuffix: true })}`
          : "No data"
        }
      </div>
    </Card>
  )
}

function ActivityCard() {
  const [activity, setActivity] = useState<TestActivity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestActivity().then((data) => {
      setActivity(data)
      setLoading(false)
    })
  }, [])

  const hasData = activity !== null && activity.testsByDays.length > 0

  let heatmapData: HeatmapData[] = []
  let chartData: LineChartData = { labels: [], datasets: [{ label: "Tests", data: [] }] }

  if (hasData) {
    const { testsByDays } = activity
    heatmapData = testsByDays.map((count: number, index: number) => {
      const date = new Date()
      date.setDate(date.getDate() - (testsByDays.length - 1 - index))
      return {
        date: date.toISOString().split("T")[0],
        count,
      }
    })

    const last30Days = heatmapData.slice(-30)
    chartData = {
      labels: last30Days.map((d) => d.date.split("-")[2]),
      datasets: [
        {
          label: "Tests",
          data: last30Days.map((d) => d.count),
        },
      ],
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Typing Activity</h2>
      {hasData ? (
        <div className="space-y-6">
          <div className="h-40">
            <LineChart data={chartData} />
          </div>
          <div className="h-32">
            <CalendarHeatmap data={heatmapData} />
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
          No data
        </div>
      )}
    </Card>
  )
}

function RecentResultsCard() {
  const [results, setResults] = useState<Result[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults(10).then((data) => {
      setResults(data)
      setLoading(false)
    })
  }, [])

  const hasData = results !== null && results.length > 0

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Recent Results</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 font-medium">Date</th>
              <th className="text-left py-2 font-medium">Mode</th>
              <th className="text-right py-2 font-medium">WPM</th>
              <th className="text-right py-2 font-medium">Acc</th>
              <th className="text-right py-2 font-medium">Consistency</th>
              <th className="text-right py-2 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {hasData ? (
              results.map((result, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-2 text-muted-foreground">{new Date(result.timestamp).toLocaleDateString()}</td>
                  <td className="py-2">
                    {result.mode} {result.mode2}
                    {result.isPb && <Badge className="ml-2 text-xs">PB</Badge>}
                  </td>
                  <td className="py-2 text-right font-mono">{result.wpm.toFixed(1)}</td>
                  <td className="py-2 text-right font-mono">{result.acc.toFixed(1)}%</td>
                  <td className="py-2 text-right font-mono">{result.consistency?.toFixed(1) || "—"}%</td>
                  <td className="py-2 text-right font-mono">{result.testDuration.toFixed(1)}s</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// =============================================================================
// Main Page
// =============================================================================

export default function TypePage() {
  return (
    <main className="container max-w-[672px] mx-auto px-4 py-16">
      <PageHeader
        title="Typing Statistics"
        subtitle="MonkeyType"
        preview="Live typing statistics from MonkeyType including personal bests, streaks, and activity history."
        status="Published"
        confidence="certain"
        importance={5}
        start_date="2024-01-01"
        end_date={new Date().toISOString().split('T')[0]}
      />

      <div className="grid gap-6 mt-8">
        <StatsOverview />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PersonalBestsCard />
          <StreakCard />
        </div>

        <ActivityCard />
        <RecentResultsCard />
      </div>

      <PageDescription
        title="About Typing Statistics"
        description="Real-time typing statistics pulled from MonkeyType API. Includes test completion rates, personal best scores across different modes, daily activity heatmaps, and recent test results."
      />
    </main>
  )
}
