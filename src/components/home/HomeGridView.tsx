/**
 * Home Grid View Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Grid view rendering for home page
 */

"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/core"
import { Post } from "@/lib/posts"
import { HomeHeader } from "./header"
import { HomeFocus } from "./HomeFocus"
import { HomeAbout } from "./HomeAbout"
import { HomeFeatured } from "./HomeFeatured"
import { HomePosts } from "./HomePosts"
import { HomeStats } from "./HomeStats"
import { HomePoetry } from "./HomePoetry"
import { HomeInterestingPeople } from "./HomeInterestingPeople"
import { GitHubContributions } from "./github"
import type { Poem } from "./poetry"

interface HomeGridViewProps {
  posts: Post[]
}

// Home page metadata for the grid view
const homePageData = {
  title: "Kris Yotam",
  subtitle: "Essays, Notes, and Musings",
  start_date: "2025-01-01",
  end_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
  preview: "A collection of writings on multiple disciplines.",
  status: "Finished" as const,
  confidence: "certain" as const,
  importance: 9,
}

export function HomeGridView({ posts }: HomeGridViewProps) {
  const [randomPoems, setRandomPoems] = useState<Poem[]>([])
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([])

  useEffect(() => {
    // Get unique categories
    const categories = [...new Set(posts.map((post) => post.category))]
    setUniqueCategories(categories)

    // Fetch and set random poems from verse.json
    const fetchPoems = async () => {
      try {
        const response = await fetch("/api/content?type=poems")
        const data = await response.json()
        // Filter active poems and shuffle - ensure data is an array
        if (!Array.isArray(data)) {
          setRandomPoems([])
          return
        }
        const activePoems = data.filter((poem: Poem) => poem.status === "Finished")
        const shuffledPoems = activePoems.sort(() => 0.5 - Math.random())
        setRandomPoems(shuffledPoems.slice(0, 2))
      } catch (error) {
        console.error("Error fetching poems:", error)
        setRandomPoems([])
      }
    }

    fetchPoems()
  }, [posts])
  return (
    <div className="p-8 md:p-12 lg:p-16">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title={homePageData.title}
          subtitle={homePageData.subtitle}
          start_date={homePageData.start_date}
          end_date={homePageData.end_date}
          preview={homePageData.preview}
          status={homePageData.status}
          confidence={homePageData.confidence}
          importance={homePageData.importance}
        />

        <HomeHeader />
        <HomeFocus />
        <HomeAbout />
        <HomeFeatured posts={posts} />
        <HomePosts posts={posts} />
        <HomeStats uniqueCategories={uniqueCategories} />
        <HomePoetry randomPoems={randomPoems} />
        <HomeInterestingPeople />
        <GitHubContributions />
      </div>
    </div>
  )
}
