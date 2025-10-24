"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Data type interfaces - same as reading-data-context.tsx
interface ReadingBook {
  title: string
  subtitle: string
  author: string
  cover: string
  link: string
}

interface BlogPost {
  title: string
  author: string
  date_read: string
  source_link: string
  archive_link: string
  word_count: number
  estimated_read_time: string
  rating: number
  notes_link: string
  publication_year: number
}

interface ShortStory {
  title: string
  author: string
  date_read: string
  source_link: string
  archive_link: string
  word_count: number
  estimated_read_time: string
  rating: number
  notes_link: string
  publication_year: number
}

interface VerseEntry {
  title: string
  author: string
  date_read: string
  source_link: string
  archive_link: string
  word_count: number
  estimated_read_time: string
  rating: number
  notes_link: string
  publication_year: number
  verse_type: string
}

interface Essay {
  title: string
  author: string
  date_read: string
  source_link: string
  archive_link: string
  word_count: number
  estimated_read_time: string
  rating: number
  notes_link: string
  publication_year: number
}

interface Paper {
  title: string
  author: string[]
  source_link: string
  archive_link: string
  publication_year: number
}

interface ReadingLogEntry {
  title: string
  author: string
  type: string
  genre: string
  sub_genre: string[]
  word_count: number
  page_count: number
  reads: Array<{
    start_date: string
    finish_date: string
  }>
}

// Reading data interface
interface WantToReadData {
  books: ReadingBook[]
  blogPosts: BlogPost[]
  shortStories: ShortStory[]
  verse: VerseEntry[]
  essays: Essay[]
  papers: Paper[]
  readingLog: ReadingLogEntry[]
}

// Context interface
interface WantToReadDataContextType {
  data: WantToReadData
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
}

const WantToReadDataContext = createContext<WantToReadDataContextType>({
  data: {
    books: [],
    blogPosts: [],
    shortStories: [],
    verse: [],
    essays: [],
    papers: [],
    readingLog: []
  },
  loading: true,
  error: null,
  refreshData: async () => {}
})

export const useWantToReadData = () => {
  const context = useContext(WantToReadDataContext)
  if (!context) {
    throw new Error('useWantToReadData must be used within a WantToReadDataProvider')
  }
  return context
}

interface WantToReadDataProviderProps {
  children: ReactNode
}

export function WantToReadDataProvider({ children }: WantToReadDataProviderProps) {
  const [data, setData] = useState<WantToReadData>({
    books: [],
    blogPosts: [],
    shortStories: [],
    verse: [],
    essays: [],
    papers: [],
    readingLog: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAllData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // For the want-to-read page, we only need to fetch from the want-to-read endpoint
      const wantToReadResponse = await fetch('/api/reading/want-to-read')

      if (!wantToReadResponse.ok) {
        throw new Error('Failed to load want-to-read data')
      }

      const wantToReadData = await wantToReadResponse.json()

      // Update state with the loaded data
      setData({
        books: wantToReadData['want-to-read'] || [],
        blogPosts: [],
        shortStories: [],
        verse: [],
        essays: [],
        papers: [],
        readingLog: []
      })

    } catch (err) {
      console.error('Error loading want-to-read data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load want-to-read data')
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount
  useEffect(() => {
    loadAllData()
  }, [])

  const refreshData = async () => {
    await loadAllData()
  }

  const value = {
    data,
    loading,
    error,
    refreshData
  }

  return (
    <WantToReadDataContext.Provider value={value}>
      {children}
    </WantToReadDataContext.Provider>
  )
}
