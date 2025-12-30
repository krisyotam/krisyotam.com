/**
 * Home Client Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Main orchestrator for home page with list/grid view toggle
 */

"use client"

import { useState } from "react"
import { Post } from "@/utils/posts"
import { HomeListView } from "./HomeListView"
import { HomeGridView } from "./HomeGridView"
import { ViewToggle } from "./ViewToggle"

interface HomeClientProps {
  posts: Post[]
  randomQuote: { text: string; author: string }
  initialView?: 'list' | 'grid'
}

export function HomeClient({ posts, randomQuote, initialView = 'list' }: HomeClientProps) {
  const [viewMode, setViewMode] = useState(initialView)

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {viewMode === "list" ? (
        <HomeListView posts={posts} randomQuote={randomQuote} />
      ) : (
        <HomeGridView posts={posts} />
      )}

      <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
    </div>
  )
}
