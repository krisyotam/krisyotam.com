"use client"

import { useState } from "react"
import videosData from "@/data/content/videos.json"
import { PostHeader } from "@/components/post-header"

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
          date={new Date().toISOString()}
          preview="collection of thought-provoking videos."
          status="In Progress"
          confidence="highly likely"
          importance={8}
        />
      </div>

      {/* —— replace this block with your own “subscribe/connect/support” info —— */}
      <div className="max-w-2xl mx-auto mb-10 prose">
        <p>
          Conversations about the nature of intelligence, consciousness, love, and power.
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Subscribe to the <a href="#">Kris Yotam</a> YouTube channel.
          </li>
          <li>
            Subscribe on <a href="#">Apple Podcasts</a>, <a href="#">Spotify</a>, <a href="#">RSS</a>. If you enjoy it, consider rating it 5 stars.
          </li>
          <li>
            Connect on <a href="#">Twitter</a>, <a href="#">LinkedIn</a>, <a href="#">Instagram</a>, <a href="#">TikTok</a>, <a href="#">Facebook</a>, <a href="#">Reddit</a>.
          </li>
          <li>
            The best way to support this podcast is to support the <a href="#">Sponsors</a>. They’re awesome! But also, consider monthly donations on <a href="#">Patreon</a> or a one-time gift via <a href="#">PayPal</a>.
          </li>
          <li>
            To contact me, please check out the <a href="#">Contact Page</a>.
          </li>
        </ol>
      </div>
      {/* —— end custom info block —— */}

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

      {/* 3 cards per row */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((video) => (
          <div key={video.episode} className="overflow-hidden">
            {/* square‐corner thumbnail */}
            <img
              src={video.image}
              alt={video.title}
              className="w-full h-32 object-cover rounded-none"
            />

            <div className="mt-2 mb-1">
              {/* episode title */}
              <a
                href={`/videos/${video.episode}`}
                className="block font-semibold mb-2 hover:underline"
              >
                {video.title}
              </a>

              {/* [ Video ] [ Episode ] [ Transcript ] */}
              <div className="text-sm">
                [{" "}
                <a
                  href={video.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  Video
                </a>{" "}
                ] [{" "}
                <a
                  href={`/videos/${video.episode}`}
                  className="text-blue-500"
                >
                  Episode
                </a>{" "}
                ] [{" "}
                <a
                  href={`/videos/${video.episode}/transcript`}
                  className="text-blue-500"
                >
                  Transcript
                </a>{" "}
                ]
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
