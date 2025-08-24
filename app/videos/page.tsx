"use client"

import { useState } from "react"
import videosData from "@/data/content/videos.json"
import { PostHeader } from "@/components/post-header"
import Collapse from "@/components/posts/typography/collapse"
import Video from "@/components/posts/media/video"

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // only include active videos and apply search filter
  const filtered = videosData
    .filter((v) => v.state === "active")
    .filter((v) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        v.title.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q))
      )
    })

  return (
    <main className="container mx-auto px-4 py-8">
      {/* header */}
      <div className="max-w-2xl mx-auto mb-8">
        <PostHeader
          title="Videos"
          subtitle="analysis, mathematics, and walkthroughs"
          start_date="2025-01-01"
          end_date={new Date().toISOString().split('T')[0]}
          preview="collection of thought-provoking videos."
          status="In Progress"
          confidence="highly likely"
          importance={8}
        />
      </div>

      {/* About Videos section */}
      <div className="max-w-2xl mx-auto mb-8">
        <Collapse title="About Videos">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Conversations about the nature of intelligence, consciousness, love, and power.
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Subscribe to the <a href="#" className="text-foreground underline hover:text-primary">Kris Yotam</a> YouTube channel.
              </li>
              <li>
                Subscribe on <a href="#" className="text-foreground underline hover:text-primary">Apple Podcasts</a>, <a href="#" className="text-foreground underline hover:text-primary">Spotify</a>, <a href="#" className="text-foreground underline hover:text-primary">RSS</a>. If you enjoy it, consider rating it 5 stars.
              </li>
              <li>
                Connect on <a href="#" className="text-foreground underline hover:text-primary">Twitter</a>, <a href="#" className="text-foreground underline hover:text-primary">LinkedIn</a>, <a href="#" className="text-foreground underline hover:text-primary">Instagram</a>, <a href="#" className="text-foreground underline hover:text-primary">TikTok</a>, <a href="#" className="text-foreground underline hover:text-primary">Facebook</a>, <a href="#" className="text-foreground underline hover:text-primary">Reddit</a>.
              </li>
              <li>
                The best way to support this podcast is to support the <a href="#" className="text-foreground underline hover:text-primary">Sponsors</a>. They're awesome! But also, consider monthly donations on <a href="#" className="text-foreground underline hover:text-primary">Patreon</a> or a one-time gift via <a href="#" className="text-foreground underline hover:text-primary">PayPal</a>.
              </li>
              <li>
                To contact me, please check out the <a href="#" className="text-foreground underline hover:text-primary">Contact Page</a>.
              </li>
            </ol>
          </div>
        </Collapse>
      </div>

      {/* search bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search title or tags…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Videos grid */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((video) => (
          <Video
            key={video.episode}
            image={video.image}
            title={video.title}
            episode={video.episode}
            video={video.video}
            category={video.category}
            subtitle={video.subtitle}
          />
        ))}
      </div>
    </main>
  )
}
