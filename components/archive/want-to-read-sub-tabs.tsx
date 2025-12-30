"use client"

import React from "react"
import { ReadingBookCard } from "@/components/reading-book-card"
import { BlogPostsTable } from "@/components/blog-posts-table"
import { ShortStoriesTable } from "@/components/short-stories-table"
import { VerseTable } from "@/components/verse-table"
import { ReadingEssaysTable } from "@/components/reading-essays-table"
import { ReadingPapersTable } from "@/components/reading-papers-table"
import { useWantToReadData } from "@/contexts/want-to-read-data-context"

type ReadingSubTabType = "books" | "blog-posts" | "short-stories" | "verse" | "essays" | "papers"

interface JsonBook {
  title: string
  subtitle: string
  author: string
  cover: string
  link: string
}

interface WantToReadSubTabsProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  showBooks?: boolean
}

export function WantToReadSubTabs({ activeTab, onTabChange, showBooks = false }: WantToReadSubTabsProps = {}) {
  const [activeSubTab, setActiveSubTab] = React.useState<ReadingSubTabType>(
    (activeTab as ReadingSubTabType) || "books"
  )
  
  // Use preloaded data from context
  const { data: wantToReadData, loading: wantToReadLoading } = useWantToReadData()
  
  // Update local state when props change
  React.useEffect(() => {
    if (activeTab) {
      setActiveSubTab(activeTab as ReadingSubTabType)
    }
  }, [activeTab])

  const handleTabClick = (subTab: ReadingSubTabType) => {
    setActiveSubTab(subTab)
    if (onTabChange) {
      onTabChange(subTab)
    }
  }

  const handleBookClick = (book: JsonBook) => {
    if (book.link) {
      window.open(book.link, '_blank')
    }
  }

  const subTabLabels: Record<ReadingSubTabType, string> = {
    "books": "Books",
    "blog-posts": "Blog Posts",
    "short-stories": "Short Stories", 
    "verse": "Verse",
    "essays": "Essays",
    "papers": "Papers",
  }

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="relative">
        <div className="flex border-b border-border">
          {Object.entries(subTabLabels).map(([subTab, label]) => (
            <button
              key={subTab}
              onClick={() => handleTabClick(subTab as ReadingSubTabType)}
              className={`px-3 py-1.5 text-xs font-medium relative transition-colors ${
                activeSubTab === subTab
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
              {activeSubTab === subTab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active sub-tab */}
      <div className="mt-4">
        {activeSubTab === "books" && (
          <>
            {wantToReadLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading books...</p>
              </div>
            ) : wantToReadData.books.length > 0 ? (
              <div className="space-y-6">
                {wantToReadData.books.map((book, index) => (
                  <ReadingBookCard
                    key={index}
                    coverUrl={book.cover}
                    title={book.title}
                    subtitle={book.subtitle || ""}
                    author={book.author}
                    rating={0}
                    onClick={() => handleBookClick(book)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No books found.</p>
              </div>
            )}
          </>
        )}
        {/* For now, these other tabs will show empty states since we're only loading books data */}
        {activeSubTab === "blog-posts" && <BlogPostsTable data={wantToReadData.blogPosts} />}
        {activeSubTab === "short-stories" && <ShortStoriesTable data={wantToReadData.shortStories} />}
        {activeSubTab === "verse" && <VerseTable data={wantToReadData.verse} />}
        {activeSubTab === "essays" && <ReadingEssaysTable data={wantToReadData.essays} />}
        {activeSubTab === "papers" && <ReadingPapersTable data={wantToReadData.papers} />}
      </div>
    </div>
  )
}
