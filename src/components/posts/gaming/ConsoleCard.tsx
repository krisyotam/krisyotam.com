import { Card, CardContent } from "@/components/ui/card"

interface GameConsole {
  id: string
  name: string
  manufacturer: string
  releaseDate: string
  coverImage: string
  description?: string
}

interface ConsoleCardProps {
  console: GameConsole
}

export function ConsoleCard({ console }: ConsoleCardProps) {
  return (
    <Card className="w-full overflow-hidden border dark:border-zinc-800 dark:bg-[#1a1a1a] flex flex-col h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={console.coverImage || "/placeholder.svg"}
          alt={console.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=150&width=150"
          }}
        />
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-1">{console.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{console.manufacturer}</p>
      </CardContent>
    </Card>
  )
}

export function ConsoleCards({ consoles }: { consoles: GameConsole[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {consoles.map((console) => (
        <ConsoleCard key={console.id} console={console} />
      ))}
    </div>
  )
}
