interface GameStatsSectionProps {
  gamesCount: number
  hoursPlayed: number
  genresCount: number
}

export function GameStatsSection({ gamesCount, hoursPlayed, genresCount }: GameStatsSectionProps) {
  // Convert hours to days, hours
  const days = Math.floor(hoursPlayed / 24)
  const hours = hoursPlayed % 24

  // Format time string
  const timeString = days > 0 ? `${days}d ${hours}h` : `${hours}h`

  return (
    <div className="border border-border bg-muted/30 dark:bg-[hsl(var(--popover))]">
      <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-6 gap-y-2">
        {/* Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold text-foreground">{gamesCount.toLocaleString()}</span>
            <span className="text-muted-foreground">games</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="hidden sm:flex items-baseline gap-1.5">
            <span className="text-xl font-semibold text-foreground">{timeString}</span>
            <span className="text-muted-foreground">playtime</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-border" />
          <div className="hidden md:flex items-baseline gap-1.5">
            <span className="text-xl font-semibold text-foreground">{genresCount.toLocaleString()}</span>
            <span className="text-muted-foreground">genres</span>
          </div>
        </div>
      </div>
    </div>
  )
}
