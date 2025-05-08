import { Film, Tv, Clock } from "lucide-react"

interface FilmStatsSectionProps {
  moviesCount: number
  episodesCount: number
  minutesWatched: number
}

export function FilmStatsSection({ moviesCount, episodesCount, minutesWatched }: FilmStatsSectionProps) {
  // Convert minutes to days, hours, minutes
  const days = Math.floor(minutesWatched / (60 * 24))
  const hours = Math.floor((minutesWatched % (60 * 24)) / 60)
  const minutes = minutesWatched % 60

  // Format time string
  const timeString = days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m`

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 p-6 text-center">
        <Film className="h-8 w-8 mx-auto mb-2 text-gray-700 dark:text-zinc-300" />
        <div className="text-3xl font-bold mb-1 dark:text-white">{moviesCount.toLocaleString()}</div>
        <div className="text-gray-500 dark:text-zinc-400">Movies Watched</div>
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 p-6 text-center">
        <Tv className="h-8 w-8 mx-auto mb-2 text-gray-700 dark:text-zinc-300" />
        <div className="text-3xl font-bold mb-1 dark:text-white">{episodesCount.toLocaleString()}</div>
        <div className="text-gray-500 dark:text-zinc-400">Episodes Watched</div>
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 p-6 text-center">
        <Clock className="h-8 w-8 mx-auto mb-2 text-gray-700 dark:text-zinc-300" />
        <div className="text-3xl font-bold mb-1 dark:text-white">{timeString}</div>
        <div className="text-gray-500 dark:text-zinc-400">Time Watched</div>
      </div>
    </div>
  )
} 