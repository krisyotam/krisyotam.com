import { Badge } from "@/components/ui/badge"

interface ProfileHeaderProps {
  profile: any
  activeTab: "anime" | "manga"
  isCollectionsPage?: boolean
}

export function ProfileHeader({ profile, activeTab, isCollectionsPage = false }: ProfileHeaderProps) {
  // Get the correct stats based on active tab
  const stats = activeTab === "anime" ? profile.anime_statistics || {} : profile.manga_statistics || {}

  const itemCount = stats.num_items || 0
  const itemLabel = activeTab === "anime" ? "Anime" : "Manga"

  // For collections page, show collections count instead of episodes/chapters
  const episodeCount = activeTab === "anime" ? stats.num_episodes || 0 : stats.num_chapters || 0
  const episodeLabel = isCollectionsPage ? "Collections" : activeTab === "anime" ? "Episodes" : "Chapters"

  // Get profile picture URL from the correct path in the API response
  const profilePicture = profile.picture || profile.images?.jpg?.image_url || "/placeholder.svg?height=100&width=100"

  // Format the joined date
  const joinedDate = profile.joined_at
    ? new Date(profile.joined_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown"

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white dark:bg-[#1a1a1a] rounded-xl p-6 shadow-sm border dark:border-gray-800">
      {/* Profile picture - clickable to MAL profile */}
      <a href="https://myanimelist.net/profile/krisyotam" target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-md">
          <img
            src={profilePicture || "/placeholder.svg"}
            alt={profile.name || "Profile"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=100&width=100"
            }}
          />
        </div>
      </a>

      <div className="flex-1 text-center md:text-left">
        <h1 className="text-xl font-bold">{profile.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">Joined {joinedDate}</p>

        <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
          <Badge
            variant="outline"
            className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          >
            {itemCount} {itemLabel}
          </Badge>
          <Badge
            variant="outline"
            className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          >
            {episodeCount} {episodeLabel}
          </Badge>
        </div>
      </div>
    </div>
  )
}

