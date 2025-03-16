import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, Calendar } from "lucide-react"

interface StatCardProps {
  title: string
  icon: React.ReactNode
  stats: Array<{
    label: string
    value: string | number
  }>
}

function StatCard({ title, icon, stats }: StatCardProps) {
  return (
    <Card className="overflow-hidden border dark:border-gray-800 dark:bg-[#1a1a1a]">
      <CardHeader className="pb-2 bg-muted/30 dark:bg-[#121212] py-3">
        <CardTitle className="text-sm flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 pb-4">
        <dl className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col">
              <dt className="text-xs text-muted-foreground">{stat.label}</dt>
              <dd className="text-xl font-bold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

interface StatsSectionProps {
  profile: any
  activeTab: "anime" | "manga"
}

export function StatsSection({ profile, activeTab }: StatsSectionProps) {
  // Get the correct stats based on active tab
  const animeStats = profile.anime_statistics || {}
  const mangaStats = profile.manga_statistics || {}

  // Use the appropriate stats object based on the active tab
  const stats = activeTab === "anime" ? animeStats : mangaStats

  // Set up labels based on active tab
  const contentType = activeTab === "anime" ? "Anime" : "Manga"
  const ongoingLabel = activeTab === "anime" ? "Watching" : "Reading"
  const episodeLabel = activeTab === "anime" ? "Episodes Watched" : "Chapters Read"
  const timeLabel = activeTab === "anime" ? "Days Watched" : "Days Reading"
  const hoursLabel = activeTab === "anime" ? "Hours Watched" : "Hours Reading"

  // Get the correct values based on active tab
  const ongoingCount = activeTab === "anime" ? stats.num_watching : stats.num_reading
  const episodeCount = activeTab === "anime" ? stats.num_episodes : stats.num_chapters

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title={`${contentType} Stats`}
        icon={<BookOpen className="h-4 w-4" />}
        stats={[
          { label: "Total Entries", value: stats.num_items || 0 },
          { label: episodeLabel, value: episodeCount || 0 },
          { label: "Mean Score", value: stats.mean_score?.toFixed(2) || "N/A" },
        ]}
      />
      <StatCard
        title="Status"
        icon={<Clock className="h-4 w-4" />}
        stats={[
          { label: ongoingLabel, value: ongoingCount || 0 },
          { label: "Completed", value: stats.num_completed || 0 },
          { label: "On Hold", value: stats.num_on_hold || 0 },
          { label: "Dropped", value: stats.num_dropped || 0 },
        ]}
      />
      <StatCard
        title="Time Spent"
        icon={<Calendar className="h-4 w-4" />}
        stats={[
          {
            label: timeLabel,
            value: (stats.num_days || 0).toFixed(1),
          },
          {
            label: hoursLabel,
            value: Math.round((stats.num_days || 0) * 24),
          },
        ]}
      />
    </div>
  )
}

