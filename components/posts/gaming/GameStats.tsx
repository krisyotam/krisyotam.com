import { Gamepad2, Clock, Layers } from "lucide-react"

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 p-6 text-center">
        <Gamepad2 className="h-8 w-8 mx-auto mb-2 text-gray-700 dark:text-zinc-300" />
        <div className="text-3xl font-bold mb-1 dark:text-white">{gamesCount.toLocaleString()}</div>
        <div className="text-gray-500 dark:text-zinc-400">Games Played</div>
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 p-6 text-center">
        <Clock className="h-8 w-8 mx-auto mb-2 text-gray-700 dark:text-zinc-300" />
        <div className="text-3xl font-bold mb-1 dark:text-white">{timeString}</div>
        <div className="text-gray-500 dark:text-zinc-400">Total Playtime</div>
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 p-6 text-center">
        <Layers className="h-8 w-8 mx-auto mb-2 text-gray-700 dark:text-zinc-300" />
        <div className="text-3xl font-bold mb-1 dark:text-white">{genresCount.toLocaleString()}</div>
        <div className="text-gray-500 dark:text-zinc-400">Genres Played</div>
      </div>
    </div>
  )
}
