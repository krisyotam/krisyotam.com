import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

// Watching/Reading Card
export function WatchingCard({ item, type = "anime" }: { item: any; type?: "anime" | "manga" }) {
  if (!item || !item.node) return null

  const content = item.node
  const status = item.list_status || {}

  const imageUrl = content.main_picture?.medium || "/placeholder.svg?height=200&width=350"
  const title = content.title || "Unknown Title"
  const score = status.score || 0

  const progress =
    type === "anime"
      ? `${status.num_episodes_watched || 0}/${content.num_episodes || "?"} eps`
      : `${status.num_chapters_read || 0}/${content.num_chapters || "?"} ch`

  const meanScore = content.mean ? content.mean.toFixed(2) : "N/A"

  return (
    <Card className="h-full overflow-hidden border dark:border-gray-800 dark:bg-[#1a1a1a]">
      <div className="aspect-[3/4] relative overflow-hidden">
        <img src={imageUrl || "/placeholder.svg"} alt={title} className="object-cover w-full h-full" />
        {score > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Star className="h-3 w-3 mr-1 text-yellow-400" />
            {score}
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-1" title={title}>
          {title}
        </h3>
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 dark:border-gray-700">
            {progress}
          </Badge>
          <span className="text-xs">⭐ {meanScore}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Completed Card
export function CompletedCard({ item, type = "anime" }: { item: any; type?: "anime" | "manga" }) {
  if (!item || !item.node) return null

  const content = item.node
  const status = item.list_status || {}

  const imageUrl = content.main_picture?.medium || "/placeholder.svg?height=200&width=350"
  const title = content.title || "Unknown Title"
  const score = status.score || 0

  const finishDate = status.finish_date
    ? new Date(status.finish_date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "Unknown date"

  const totalCount = type === "anime" ? `${content.num_episodes || "?"} eps` : `${content.num_chapters || "?"} ch`

  return (
    <Card className="h-full overflow-hidden border dark:border-gray-800 dark:bg-[#1a1a1a]">
      <div className="aspect-[3/4] relative overflow-hidden">
        <img src={imageUrl || "/placeholder.svg"} alt={title} className="object-cover w-full h-full" />
        {score > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Star className="h-3 w-3 mr-1 text-yellow-400" />
            {score}
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-1" title={title}>
          {title}
        </h3>
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 dark:border-gray-700">
            {totalCount}
          </Badge>
          <span className="text-xs">{finishDate}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Favorite Card
export function FavoriteCard({ item, type }: { item: any; type: string }) {
  if (!item) return null

  // Handle different API response formats
  const imageUrl =
    item.images?.jpg?.image_url ||
    item.picture?.large ||
    item.main_picture?.large ||
    "/placeholder.svg?height=200&width=350"

  const title = item.name || item.title || "Unknown"
  const url = item.url || `https://myanimelist.net/${type}/${item.id || item.mal_id}`

  // Additional info based on type
  let subtitle = ""
  if (type === "anime") {
    subtitle = item.type || item.media_type || ""
    if (item.year) subtitle += ` (${item.year})`
  } else if (type === "manga") {
    subtitle = item.type || item.media_type || ""
    if (item.published?.from) {
      const year = new Date(item.published.from).getFullYear()
      subtitle += ` (${year})`
    }
  } else if (type === "character") {
    subtitle = item.from?.name || item.anime?.title || ""
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full">
      <Card className="h-full overflow-hidden border dark:border-gray-800 dark:bg-[#1a1a1a]">
        <div className="aspect-[3/4] relative overflow-hidden">
          <img src={imageUrl || "/placeholder.svg"} alt={title} className="object-cover w-full h-full" />
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-xs line-clamp-1" title={title}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1" title={subtitle}>
              {subtitle}
            </p>
          )}
        </CardContent>
      </Card>
    </a>
  )
}

