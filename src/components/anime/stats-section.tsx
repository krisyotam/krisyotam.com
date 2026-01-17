import type React from "react"
import { BookOpen, Clock, Calendar } from "lucide-react"

interface StatCardProps {
  title: string
  icon: React.ReactNode
  value: string | number
  description: string
}

function StatCard({ title, icon, value, description }: StatCardProps) {
  return (
    <div className="p-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] w-full text-center">
      {icon}
      <div className="text-3xl font-bold mb-1 dark:text-white">{value}</div>
      <div className="text-gray-500 dark:text-zinc-400">{description}</div>
    </div>
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
  const ongoingLabel = activeTab === "anime" ? "Currently Watching" : "Currently Reading"
  const episodeLabel = activeTab === "anime" ? "Episodes Watched" : "Chapters Read"

  // Get the correct values based on active tab
  const ongoingCount = activeTab === "anime" ? stats.num_watching : stats.num_reading
  const episodeCount = activeTab === "anime" ? stats.num_episodes : stats.num_chapters

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title={`Total ${contentType}`}
        icon={<BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-700 dark:text-zinc-300" />}
        value={(stats.num_items || 0).toLocaleString()}
        description={`Total ${contentType} Entries`}
      />
      
      <StatCard
        title="Currently Active"
        icon={<Clock className="h-8 w-8 mx-auto mb-2 text-gray-700 dark:text-zinc-300" />}
        value={(ongoingCount || 0).toLocaleString()}
        description={ongoingLabel}
      />
      
      <StatCard
        title="Time Spent"
        icon={<Calendar className="h-8 w-8 mx-auto mb-2 text-gray-700 dark:text-zinc-300" />}
        value={(stats.num_days || 0).toFixed(1)}
        description="Days Total"
      />
    </div>
  )
}

