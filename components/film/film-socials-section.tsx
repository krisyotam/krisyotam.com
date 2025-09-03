import Link from "next/link"
import { ExternalLink, Film, TrendingUp, Star, List, Users } from "lucide-react"

interface FilmSocial {
  name: string
  description: string
  url: string
  icon: React.ReactNode
  username?: string
}

const filmSocials: FilmSocial[] = [
  {
    name: "Trakt.tv",
    description: "Track movies and TV shows with automatic scrobbling and detailed statistics",
    url: "https://trakt.tv/users/krisyotam",
    icon: <TrendingUp className="h-5 w-5" />,
    username: "@krisyotam"
  },
  {
    name: "IMDb",
    description: "Rate and review movies and TV shows on the world's most popular movie database",
    url: "https://www.imdb.com/user/ur108802760/",
    icon: <Star className="h-5 w-5" />,
    username: "ur108802760"
  },
  {
    name: "Letterboxd",
    description: "Social network for film lovers to discover, rate, and review movies",
    url: "https://letterboxd.com/krisyotam/",
    icon: <Film className="h-5 w-5" />,
    username: "@krisyotam"
  },
  {
    name: "The Movie Database",
    description: "Contribute to the open movie database with ratings and reviews",
    url: "https://www.themoviedb.org/u/krisyotam",
    icon: <List className="h-5 w-5" />,
    username: "@krisyotam"
  },
  {
    name: "TV Time",
    description: "Track TV shows and get personalized recommendations",
    url: "https://www.tvtime.com/user/krisyotam",
    icon: <Users className="h-5 w-5" />,
    username: "@krisyotam"
  }
]

export function FilmSocialsSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Film Socials</h2>
      <div className="space-y-3">
        {filmSocials.map((social) => (
          <Link
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] border border-border"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {social.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-foreground">{social.name}</h3>
                  {social.username && (
                    <span className="text-sm text-muted-foreground">{social.username}</span>
                  )}
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{social.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
