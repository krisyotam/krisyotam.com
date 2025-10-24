import { Card, CardContent } from "@/components/ui/card"

interface GamePlatform {
  id: string
  name: string
  company: string
  releaseDate: string
  coverImage: string
  description?: string
}

interface PlatformCardProps {
  platform: GamePlatform
}

export function PlatformCard({ platform }: PlatformCardProps) {
  return (
    <Card className="w-full overflow-hidden border dark:border-zinc-800 dark:bg-[#1a1a1a] flex flex-col h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={platform.coverImage || "/placeholder.svg"}
          alt={platform.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=150&width=150"
          }}
        />
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-1">{platform.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{platform.company}</p>
      </CardContent>
    </Card>
  )
}

export function PlatformCards({ platforms }: { platforms: GamePlatform[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {platforms.map((platform) => (
        <PlatformCard key={platform.id} platform={platform} />
      ))}
    </div>
  )
}
