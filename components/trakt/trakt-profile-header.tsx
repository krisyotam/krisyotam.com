import Image from "next/image"
import { CalendarDays, MapPin, Star } from "lucide-react"
import formatDistanceToNow from "date-fns/formatDistanceToNow"

interface TraktProfileHeaderProps {
  username: string
  fullName: string
  avatar: string
  bio: string
  joinedAt: string
  location: string
  vip: boolean
}

export function TraktProfileHeader({
  username,
  fullName,
  avatar,
  bio,
  joinedAt,
  location,
  vip,
}: TraktProfileHeaderProps) {
  const joinedDate = new Date(joinedAt)
  const joinedTimeAgo = formatDistanceToNow(joinedDate, { addSuffix: true })

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative h-32 w-32 rounded-lg overflow-hidden border-4 border-gray-200 dark:border-zinc-800">
          <Image
            src={avatar || "https://doc.krisyotam.com/site/krisyotam-smoking-colored.jpg"}
            alt={fullName}
            fill
            sizes="128px"
            className="object-cover"
            unoptimized={avatar?.includes('krisyotam.com')}
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold dark:text-white">{fullName}</h1>
          <p className="text-gray-500 dark:text-zinc-400 mb-2">@{username}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-3">
            {location && (
              <div className="flex items-center text-sm text-gray-600 dark:text-zinc-300">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{location}</span>
              </div>
            )}

            <div className="flex items-center text-sm text-gray-600 dark:text-zinc-300">
              <CalendarDays className="h-4 w-4 mr-1" />
              <span>Joined {joinedTimeAgo}</span>
            </div>

            {vip && (
              <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                <Star className="h-4 w-4 mr-1 fill-yellow-500" />
                <span>VIP Member</span>
              </div>
            )}
          </div>

          {bio && <p className="text-gray-700 dark:text-zinc-300 mb-4">{bio}</p>}

          <a
            href={`https://trakt.tv/users/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-300 hover:bg-gray-400 dark:bg-[#333333] dark:hover:bg-[#4D4D4D] text-black dark:text-white font-medium py-2 px-4 rounded transition-colors"
          >
            View Profile
          </a>
        </div>
      </div>
    </div>
  )
}