import { Suspense } from "react"
import { getStats, getPersonalBests, getTestActivity, getResults, getStreak } from "@/lib/monkeytype"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarHeatmap } from "@/components/calendar-heatmap"
import { LineChart } from "@/components/line-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"
import { CommandMenu } from "@/components/command-menu"

export const dynamic = "force-dynamic"
export const revalidate = 60 // Revalidate every minute

export default async function TypePage() {
  return (
    <main className="container py-10 max-w-4xl mx-auto">
      <div className="grid gap-6">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsOverview />
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Suspense fallback={<CardSkeleton title="Personal Bests" />}>
            <PersonalBestsCard />
          </Suspense>

          <Suspense fallback={<CardSkeleton title="Current Streak" />}>
            <StreakCard />
          </Suspense>
        </div>

        <Suspense fallback={<CardSkeleton title="Typing Activity" height="h-80" />}>
          <ActivityCard />
        </Suspense>

        <Suspense fallback={<CardSkeleton title="Recent Results" height="h-96" />}>
          <RecentResultsCard />
        </Suspense>
      </div>

      <CommandMenu />
    </main>
  )
}

async function StatsOverview() {
  const stats = await getStats()

  if (!stats) {
    return <StatsCardSkeleton />
  }

  const { completedTests, startedTests, timeTyping } = stats

  // Convert timeTyping from seconds to hours and minutes
  const hours = Math.floor(timeTyping / 3600)
  const minutes = Math.floor((timeTyping % 3600) / 60)

  // Calculate completion rate
  const completionRate = startedTests > 0 ? Math.round((completedTests / startedTests) * 100) : 0

  return (
    <Card className="p-6">
      <h2 className="text-xl font-medium mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatItem title="Tests Completed" value={completedTests.toLocaleString()} icon="check-circle" />
        <StatItem title="Tests Started" value={startedTests.toLocaleString()} icon="play" />
        <StatItem title="Completion Rate" value={`${completionRate}%`} icon="percent" />
        <StatItem title="Time Typing" value={`${hours}h ${minutes}m`} icon="clock" />
      </div>
    </Card>
  )
}

async function PersonalBestsCard() {
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

  try {
    const personalBests = await Promise.all(
      modes.map(async ({ mode, mode2 }) => {
        try {
          const pb = await getPersonalBests(mode, mode2)
          console.log(`PB for ${mode} ${mode2}:`, pb)
          return { mode, mode2, data: pb }
        } catch (error) {
          console.error(`Error fetching PB for ${mode} ${mode2}:`, error)
          return { mode, mode2, data: null, error: true }
        }
      }),
    )

    return (
      <Card className="p-6 h-full">
        <h2 className="text-xl font-medium mb-4">Personal Bests</h2>
        <Tabs defaultValue="time">
          <TabsList className="mb-4">
            <TabsTrigger value="time">Time</TabsTrigger>
            <TabsTrigger value="words">Words</TabsTrigger>
          </TabsList>

          <TabsContent value="time" className="space-y-4">
            {personalBests
              .filter((pb) => pb.mode === "time")
              .map((pb) => (
                <div key={`${pb.mode}-${pb.mode2}`} className="flex justify-between items-center border-b pb-2">
                  <div className="font-medium">{pb.mode2} seconds</div>
                  {pb.data ? (
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="font-mono">
                        {pb.data.wpm?.toFixed(2) || "0.00"} WPM
                      </Badge>
                      <Badge variant="outline" className="font-mono">
                        {pb.data.acc?.toFixed(2) || "0.00"}% ACC
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {pb.data.timestamp ? new Date(pb.data.timestamp).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {pb.error ? "Error loading data" : "No data available"}
                    </span>
                  )}
                </div>
              ))}
          </TabsContent>

          <TabsContent value="words" className="space-y-4">
            {personalBests
              .filter((pb) => pb.mode === "words")
              .map((pb) => (
                <div key={`${pb.mode}-${pb.mode2}`} className="flex justify-between items-center border-b pb-2">
                  <div className="font-medium">{pb.mode2} words</div>
                  {pb.data ? (
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="font-mono">
                        {pb.data.wpm?.toFixed(2) || "0.00"} WPM
                      </Badge>
                      <Badge variant="outline" className="font-mono">
                        {pb.data.acc?.toFixed(2) || "0.00"}% ACC
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {pb.data.timestamp ? new Date(pb.data.timestamp).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {pb.error ? "Error loading data" : "No data available"}
                    </span>
                  )}
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </Card>
    )
  } catch (error) {
    console.error("Error in PersonalBestsCard:", error)
    return <CardSkeleton title="Personal Bests" />
  }
}

async function StreakCard() {
  const streak = await getStreak()

  if (!streak) {
    return <CardSkeleton title="Current Streak" />
  }

  const { length, maxLength, lastResultTimestamp } = streak
  const lastTestDate = new Date(lastResultTimestamp)

  return (
    <Card className="p-6 h-full">
      <h2 className="text-xl font-medium mb-4">Streak</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-lg">
          <span className="text-3xl font-medium">{length}</span>
          <span className="text-sm text-muted-foreground mt-2 font-light">Current Streak</span>
        </div>
        <div className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-lg">
          <span className="text-3xl font-medium">{maxLength}</span>
          <span className="text-sm text-muted-foreground mt-2 font-light">Max Streak</span>
        </div>
      </div>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Last test: {formatDistanceToNow(lastTestDate, { addSuffix: true })}
      </div>
    </Card>
  )
}

async function ActivityCard() {
  const activity = await getTestActivity()

  if (!activity) {
    return <CardSkeleton title="Typing Activity" height="h-80" />
  }

  const { testsByDays } = activity

  // Prepare data for heatmap
  const heatmapData = testsByDays.map((count, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (testsByDays.length - 1 - index))
    return {
      date: date.toISOString().split("T")[0],
      count,
    }
  })

  // Prepare data for line chart
  const last30Days = heatmapData.slice(-30)
  const chartData = {
    labels: last30Days.map((d: { date: string }) => d.date.split("-")[2]), // Just the day
    datasets: [
      {
        label: "Tests",
        data: last30Days.map((d: { count: number }) => d.count),
      },
    ],
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-medium mb-4">Typing Activity</h2>
      <div className="space-y-6">
        <div className="h-40">
          <LineChart data={chartData} />
        </div>
        <div className="h-32">
          <CalendarHeatmap data={heatmapData} />
        </div>
      </div>
    </Card>
  )
}

async function RecentResultsCard() {
  const results = await getResults(20)

  if (!results || results.length === 0) {
    return <CardSkeleton title="Recent Results" height="h-96" />
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-medium mb-4">Recent Results</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Mode</th>
              <th className="text-right py-2">WPM</th>
              <th className="text-right py-2">Accuracy</th>
              <th className="text-right py-2">Consistency</th>
              <th className="text-right py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result: any, index: number) => (
              <tr key={index} className="border-b hover:bg-muted/50">
                <td className="py-2">{new Date(result.timestamp).toLocaleDateString()}</td>
                <td className="py-2">
                  {result.mode} {result.mode2}
                  {result.isPb && <Badge className="ml-2">PB</Badge>}
                </td>
                <td className="py-2 text-right font-mono">{result.wpm.toFixed(2)}</td>
                <td className="py-2 text-right font-mono">{result.acc.toFixed(2)}%</td>
                <td className="py-2 text-right font-mono">{result.consistency?.toFixed(2) || "-"}%</td>
                <td className="py-2 text-right font-mono">{result.testDuration.toFixed(1)}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

interface StatItemProps {
  title: string
  value: string
  icon: string
}

function StatItem({ title, value, icon }: StatItemProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-primary/10 rounded-lg">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-2">
        <span className={`lucide lucide-${icon}`} />
      </div>
      <div className="text-xl font-medium">{value}</div>
      <div className="text-sm text-muted-foreground font-light">{title}</div>
    </div>
  )
}

function StatsCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="h-8 w-40 bg-muted rounded mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
        ))}
      </div>
    </Card>
  )
}

interface CardSkeletonProps {
  title: string
  height?: string
}

function CardSkeleton({ title, height = "h-64" }: CardSkeletonProps) {
  return (
    <Card className={`p-6 ${height}`}>
      <div className="h-8 w-40 bg-muted rounded mb-4"></div>
      <div className="h-full bg-muted rounded animate-pulse"></div>
    </Card>
  )
}

