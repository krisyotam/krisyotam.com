import { Card, CardContent } from "@/components/ui/card"
import { Star, Clock } from "lucide-react"

interface Game {
  id: string
  name: string
  version?: string
  releaseDate: string
  console: string
  hoursPlayed: number
  genre: string[]
  coverImage: string
  developer?: string
  publisher?: string
  rating?: number
  favorite?: boolean
  favoriteWeight?: number
  dateLastPlayed?: string
}

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Card className="w-full overflow-hidden border dark:border-zinc-800 dark:bg-[#1a1a1a] flex flex-col h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
      <div className="relative aspect-[2/3] overflow-hidden">        <img
          src={game.coverImage || "/placeholder.svg"}
          alt={game.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=180&width=120"
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <span className="text-white text-xs font-medium">{game.console}</span>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{game.name}</h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {game.hoursPlayed}h
          </div>
          {game.genre && (
            <span className="text-xs bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
              {game.genre[0]}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function GameCards({ games }: { games: Game[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}
