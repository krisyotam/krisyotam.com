import { Film, Tv, Clock } from "lucide-react"

interface FilmStatsSectionProps {
  moviesCount: number
  tvShowsCount: number
  hoursWatched: number
}

export function FilmStatsSection({ moviesCount, tvShowsCount, hoursWatched }: FilmStatsSectionProps) {
  // Format hours with decimal places for more precision
  const formattedHours = hoursWatched.toLocaleString(undefined, { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 1 
  })
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] w-full text-center">
        <Film className="h-8 w-8 mx-auto mb-2 text-gray-700 dark:text-zinc-300" />
        <div className="text-3xl font-bold mb-1 dark:text-white">{moviesCount.toLocaleString()}</div>
        <div className="text-gray-500 dark:text-zinc-400">Movies Watched</div>
      </div>

      <div className="p-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] w-full text-center">
        <Tv className="h-8 w-8 mx-auto mb-2 text-gray-700 dark:text-zinc-300" />
        <div className="text-3xl font-bold mb-1 dark:text-white">{tvShowsCount.toLocaleString()}</div>
        <div className="text-gray-500 dark:text-zinc-400">Watched This Year</div>
      </div>

      <div className="p-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] w-full text-center">
        <Clock className="h-8 w-8 mx-auto mb-2 text-gray-700 dark:text-zinc-300" />
        <div className="text-3xl font-bold mb-1 dark:text-white">{formattedHours}</div>
        <div className="text-gray-500 dark:text-zinc-400">Hours Watched</div>
      </div>
    </div>
  )
}