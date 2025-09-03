import { Star } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AnimeCardProps {
  id: number
  title: string
  imageUrl: string
  episodes: number | null
  rating: number | null
}

export function AnimeCard({ id, title, imageUrl, episodes, rating }: AnimeCardProps) {
  return (
    <Card className="overflow-hidden transition-colors hover:bg-accent/50 group h-full">
      <div className="flex">
        <div className="w-[80px] bg-muted p-2 flex items-center justify-center">
          <div className="relative w-full h-[110px]">
            <Image
              src={imageUrl || "/placeholder.svg?height=110&width=80"}
              alt={title}
              fill
              unoptimized={imageUrl?.startsWith("http")}
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex-1 p-3 overflow-hidden flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">ID: {id}</div>
            <h3 className="font-medium text-sm leading-tight line-clamp-2">{title}</h3>
            <p className="text-xs text-muted-foreground">{episodes ? `${episodes} episodes` : "? episodes"}</p>
          </div>
          <div className="flex items-center justify-between mt-1">
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span className="text-xs text-muted-foreground">{rating.toFixed(2)}</span>
              </div>
            )}
            <Button variant="outline" size="sm" className="h-7 text-xs px-2">
              <a href={`https://myanimelist.net/anime/${id}`} target="_blank" rel="noopener noreferrer">
                Info
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

