"use client"

import { ExternalLink } from "lucide-react"

const SOCIALS_DATA = [
  {
    name: "Last.fm",
    purpose: "Track what I listen to live",
    link: "https://www.last.fm/user/krisyotam",
    username: "krisyotam",
  },
  {
    name: "Letterboxd",
    purpose: "Cinema reviews and tracking",
    link: "https://letterboxd.com/krisyotam",
    username: "krisyotam",
  },
  {
    name: "MyAnimeList",
    purpose: "Anime and manga tracking and reviews",
    link: "https://myanimelist.net/profile/krisyotam",
    username: "krisyotam",
  },
  {
    name: "Hardcover",
    purpose: "Books, graphic novels, and comics I read",
    link: "https://hardcover.app/@krisyotam",
    username: "krisyotam",
  },
  {
    name: "Substack",
    purpose: "Exclusive essays, writings, and updates",
    link: "https://substack.com/@krisyotam",
    username: "krisyotam",
  },
  {
    name: "Pinterest",
    purpose: "Avant-garde art, lists, and rare finds",
    link: "https://www.pinterest.com/krisyotam/",
    username: "krisyotam",
  },
  {
    name: "Reddit",
    purpose: "Discussions, updates, and social interactions",
    link: "https://www.reddit.com/user/krisyotam/",
    username: "krisyotam",
  },
]

export default function MySites() {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SOCIALS_DATA.map((site) => (
          <a
            key={site.name}
            href={site.link}
            target="_blank"
            rel="noopener noreferrer"
            data-no-preview="true"
            className="group flex items-start gap-3 border border-border px-4 py-3 hover:bg-secondary/50 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {site.name}
                </span>
                <span className="text-xs text-muted-foreground">@{site.username}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {site.purpose}
              </p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  )
}
