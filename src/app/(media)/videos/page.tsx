"use client"

import { useState, useEffect } from "react"
import { PostHeader } from "@/components/core"
import { PageDescription } from "@/components/core"
import { Navigation } from "@/components/content/navigation"
import Video from "@/components/typography/video"

interface VideoData {
  slug: string
  title: string
  subtitle: string
  preview: string
  image: string
  video: string
  category: string
  tags: string[]
  date: string
  status: string
  confidence: string
  importance: number
  state: string
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("/api/videos")
        if (!response.ok) throw new Error("Failed to fetch videos")
        const data = await response.json()
        setVideos(data)
      } catch (error) {
        console.error("Error loading videos:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  // Get unique categories for filter
  const categories = Array.from(new Set(videos.map(v => v.category).filter(Boolean)))
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map(c => ({ value: c, label: c }))
  ]

  // Apply search and category filter
  const filtered = videos.filter((v) => {
    const matchesCategory = selectedCategory === "all" || v.category === selectedCategory
    if (!searchQuery.trim()) return matchesCategory
    const q = searchQuery.toLowerCase()
    return matchesCategory && (
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

      {/* Navigation */}
      <div className="max-w-2xl mx-auto">
        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search videos..."
          showCategoryFilter={true}
          categoryOptions={categoryOptions}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Videos grid */}
      {loading ? (
        <div className="max-w-2xl mx-auto text-center py-12">Loading videos...</div>
      ) : (
        <div className={`max-w-2xl mx-auto ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-4"}`}>
          {filtered.map((video) => (
            <Video
              key={video.slug}
              image={video.image}
              title={video.title}
              episode={video.slug}
              video={video.video}
              category={video.category}
              subtitle={video.subtitle}
            />
          ))}
        </div>
      )}

      {/* Page Description */}
      <PageDescription
        title="About Videos"
        description="Conversations about the nature of intelligence, consciousness, love, and power. Subscribe to the [Kris Yotam](https://youtube.com/@krisyotam) YouTube channel, [Apple Podcasts](https://podcasts.apple.com), [Spotify](https://spotify.com), or [RSS](/feeds/rss.xml). Connect on [Twitter](https://twitter.com/kaborakris), [LinkedIn](https://linkedin.com/in/krisyotam), [Instagram](https://instagram.com/krisyotam), and [Reddit](https://reddit.com/u/krisyotam). Support the channel through [Patreon](https://patreon.com/krisyotam) or [PayPal](https://paypal.me/krisyotam)."
      />
    </main>
  )
}
