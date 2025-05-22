import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface AnimeNode {
  main_picture?: {
    medium?: string;
    large?: string;
  };
  title?: string;
  my_list_status?: {
    score?: number;
    num_episodes_watched?: number;
    num_chapters_read?: number;
  };
  num_episodes?: number;
  num_chapters?: number;
}

interface AnimeItem {
  node?: AnimeNode;
  main_picture?: {
    medium?: string;
    large?: string;
  };
  images?: {
    jpg?: {
      image_url?: string;
    };
  };
  picture?: {
    large?: string;
  };
  title?: string;
  name?: string;
  list_status?: {
    score?: number;
    num_episodes_watched?: number;
    num_chapters_read?: number;
  };
  my_list_status?: {
    score?: number;
    num_episodes_watched?: number;
    num_chapters_read?: number;
  };
  id?: number;
  mal_id?: number;
  url?: string;
  link?: string;
  photolink?: string;
  description?: string;
  num_episodes?: number; // Added to align with AnimeNode and usage in getTotal
  num_chapters?: number; // Added to align with AnimeNode and usage in getTotal
}

// Helper function to get image URL with fallback
function getImageUrl(item: AnimeItem): string {
  return (
    item?.node?.main_picture?.medium ||
    item?.main_picture?.medium ||
    item?.images?.jpg?.image_url ||
    item?.picture?.large ||
    "/placeholder.svg?height=180&width=120"
  )
}

// Helper function to get title with fallback
function getTitle(item: AnimeItem): string {
  return item?.node?.title || item?.title || item?.name || "Unknown Title"
}

// Helper function to get score with fallback
function getScore(item: AnimeItem): number | null {
  const listStatus = item?.node?.my_list_status || item?.list_status || item?.my_list_status
  return listStatus?.score || null
}

// Helper function to get progress with fallback
function getProgress(item: AnimeItem, type: "anime" | "manga" = "anime"): number {
  const listStatus = item?.node?.my_list_status || item?.list_status || item?.my_list_status
  return listStatus?.[type === "anime" ? "num_episodes_watched" : "num_chapters_read"] || 0
}

// Helper function to get total with fallback
function getTotal(item: AnimeItem, type: "anime" | "manga" = "anime"): number | null {
  const node = item?.node || item
  return node?.[type === "anime" ? "num_episodes" : "num_chapters"] || null
}

interface AnimeCardProps {
  anime: AnimeItem
  type?: "anime" | "manga"
}

export function WatchingAnimeCard({ anime, type = "anime" }: AnimeCardProps) {
  const imageUrl = getImageUrl(anime)
  const title = getTitle(anime)
  const score = getScore(anime)
  const progress = getProgress(anime, type)
  const total = getTotal(anime, type)

  const progressLabel = type === "anime" ? "Episode" : "Chapter"
  const progressText = total ? `${progress}/${total}` : `${progress}`

  return (
    <Card className="w-full overflow-hidden border dark:border-gray-800 dark:bg-[#1a1a1a] flex flex-col h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=180&width=120"
          }}
        />
        {score && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center">
            <Star className="h-3 w-3 mr-0.5 text-yellow-400" />
            {score}
          </div>
        )}
      </div>
      <CardContent className="p-3 flex-1 flex flex-col">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{title}</h3>
        <div className="mt-auto">
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full"
              style={{
                width: total ? `${(progress / total) * 100}%` : "100%",
              }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {progressLabel} {progressText}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function CompletedAnimeCard({ anime, type = "anime" }: AnimeCardProps) {
  const imageUrl = getImageUrl(anime)
  const title = getTitle(anime)
  const score = getScore(anime)
  const total = getTotal(anime, type)

  const totalLabel = type === "anime" ? "Episodes" : "Chapters"

  return (
    <Card className="w-full overflow-hidden border dark:border-gray-800 dark:bg-[#1a1a1a] flex flex-col h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=180&width=120"
          }}
        />
        {score && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center">
            <Star className="h-3 w-3 mr-0.5 text-yellow-400" />
            {score}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <span className="text-white text-xs font-medium">Completed</span>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{title}</h3>
        {total && (
          <p className="text-xs text-muted-foreground">
            {total} {totalLabel}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface FavoriteCardProps {
  item: AnimeItem
  type: "anime" | "manga" | "character"
  isCompany?: boolean
  subtitle?: string
  onImageError?: () => void
}

export function AnimeFavoriteCard({ item, type, isCompany = false, subtitle, onImageError }: FavoriteCardProps) {
  // Handle different API response formats
  const imageUrl =
    item?.images?.jpg?.image_url ||
    item?.picture?.large ||
    item?.main_picture?.large ||
    item?.photolink ||
    "/placeholder.svg?height=180&width=120"

  const title = item?.name || item?.title || "Unknown"
  const url = item?.url || item?.link || `https://myanimelist.net/${type}/${item?.id || item?.mal_id}`

  const aspectRatioClass = isCompany ? "aspect-square" : "aspect-[2/3]"

  return (
    <Card className="w-full overflow-hidden border dark:border-gray-800 dark:bg-[#1a1a1a] flex flex-col h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
      <div className={`relative ${aspectRatioClass} overflow-hidden`}>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
          onError={onImageError}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <span className="text-white text-xs font-medium">Favorite</span>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-2">
          <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {title}
          </a>
        </h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}

