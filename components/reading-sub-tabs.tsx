"use client"

import React, { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { GET_READING_STATES } from "@/lib/queries"
import { ReadingBookCard } from "@/components/reading-book-card"
import { BlogPostsTable } from "@/components/blog-posts-table"
import { ShortStoriesTable } from "@/components/short-stories-table"
import { VerseTable } from "@/components/verse-table"
import { ReadingEssaysTable } from "@/components/reading-essays-table"
import { ReadingPapersTable } from "@/components/reading-papers-table"
import { useReadingData } from "@/contexts/reading-data-context"

type ReadingSubTabType = "books" | "blog-posts" | "short-stories" | "verse" | "essays" | "papers"

interface Author {
  name: string
}

interface Book {
  id: any
  cover?: string
  title: string
  subtitle?: string
  authors: Author[]
  slug: string
}

interface ReadingState {
  status: string
  book: Book
}

interface JsonBook {
  title: string
  subtitle: string
  author: string
  cover: string
  link: string
}

interface ReadingSubTabsProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  showBooks?: boolean
  wantToRead?: boolean
}

export function ReadingSubTabs({ activeTab, onTabChange, showBooks = false, wantToRead = false }: ReadingSubTabsProps = {}) {
  const [activeSubTab, setActiveSubTab] = useState<ReadingSubTabType>(
    (activeTab as ReadingSubTabType) || "books"
  )
  const [searchQuery, setSearchQuery] = useState("")
  
  // Use preloaded data from context
  const { data: readingData, loading: readingLoading } = useReadingData()
  
  const { data } = useQuery(GET_READING_STATES)
  const readingStates = data?.myReadingStates || []
  const finishedBooks = readingStates.filter((state: ReadingState) => state.status === "FINISHED")

  // No need for individual loading anymore - data is preloaded

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
    console.log('Book clicked:', book.title, 'Link:', book.link);
    if (book.link) {
      const url = book.link.startsWith('http')
        ? book.link
        : `https://${book.link}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  // Filter books based on search query
  const filteredBooks = readingData.books.filter((book) => {
    const q = searchQuery.toLowerCase()
    return (
      !q ||
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q)
    )
  })

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
            {readingLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading books...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Search bar for books */}
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search books..." 
                    className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                  />
                </div>

                {filteredBooks.length > 0 ? (
                  <div className="space-y-6">
                    {filteredBooks.slice().reverse().map((book, index) => (
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
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No books found matching your search.' : 'No books found.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {activeSubTab === "blog-posts" && <BlogPostsTable data={readingData.blogPosts} />}
        {activeSubTab === "short-stories" && <ShortStoriesTable data={readingData.shortStories} />}
        {activeSubTab === "verse" && <VerseTable data={readingData.verse} />}
        {activeSubTab === "essays" && <ReadingEssaysTable data={readingData.essays} />}
        {activeSubTab === "papers" && <ReadingPapersTable data={readingData.papers} />}
      </div>
    </div>
  )
}
