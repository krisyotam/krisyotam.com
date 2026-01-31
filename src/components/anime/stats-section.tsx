interface StatsSectionProps {
  profile: any
  activeTab: "anime" | "manga"
}

export function StatsSection({ profile, activeTab }: StatsSectionProps) {
  const animeStats = profile.anime_statistics || {}
  const mangaStats = profile.manga_statistics || {}
  const stats = activeTab === "anime" ? animeStats : mangaStats

  const contentType = activeTab === "anime" ? "entries" : "entries"
  const ongoingLabel = activeTab === "anime" ? "watching" : "reading"
  const episodeLabel = activeTab === "anime" ? "episodes" : "chapters"

  const ongoingCount = activeTab === "anime" ? stats.num_watching : stats.num_reading
  const episodeCount = activeTab === "anime" ? stats.num_episodes : stats.num_chapters

  return (
    <div className="border border-border bg-muted/30 dark:bg-[hsl(var(--popover))]">
      <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-6 gap-y-2">
        {/* Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold text-foreground">{(stats.num_items || 0).toLocaleString()}</span>
            <span className="text-muted-foreground">{contentType}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="hidden sm:flex items-baseline gap-1.5">
            <span className="text-xl font-semibold text-foreground">{(ongoingCount || 0).toLocaleString()}</span>
            <span className="text-muted-foreground">{ongoingLabel}</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-border" />
          <div className="hidden md:flex items-baseline gap-1.5">
            <span className="text-xl font-semibold text-foreground">{(episodeCount || 0).toLocaleString()}</span>
            <span className="text-muted-foreground">{episodeLabel}</span>
          </div>
          <div className="hidden lg:block w-px h-4 bg-border" />
          <div className="hidden lg:flex items-baseline gap-1.5">
            <span className="text-xl font-semibold text-foreground">{(stats.num_days || 0).toFixed(1)}</span>
            <span className="text-muted-foreground">days</span>
          </div>
        </div>
      </div>
    </div>
  )
}
