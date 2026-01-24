"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Data type interfaces
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
  date: string
  title: string
  author: string
  type: string
  minutes: number
}

// Reading data interface
interface ReadingData {
  books: ReadingBook[]
  audiobooks: ReadingBook[]
  blogPosts: BlogPost[]
  shortStories: ShortStory[]
  verse: VerseEntry[]
  essays: Essay[]
  papers: Paper[]
  readingLog: ReadingLogEntry[]
  wantToRead: ReadingBook[]
}

// Context interface
interface ReadingDataContextType {
  data: ReadingData
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
}

const ReadingDataContext = createContext<ReadingDataContextType>({
  data: {
    books: [],
    audiobooks: [],
    blogPosts: [],
    shortStories: [],
    verse: [],
    essays: [],
    papers: [],
    readingLog: [],
    wantToRead: []
  },
  loading: true,
  error: null,
  refreshData: async () => {}
})

export const useReadingData = () => {
  const context = useContext(ReadingDataContext)
  if (!context) {
    throw new Error('useReadingData must be used within a ReadingDataProvider')
  }
  return context
}

interface ReadingDataProviderProps {
  children: ReactNode
}

export function ReadingDataProvider({ children }: ReadingDataProviderProps) {
  const [data, setData] = useState<ReadingData>({
    books: [],
    audiobooks: [],
    blogPosts: [],
    shortStories: [],
    verse: [],
    essays: [],
    papers: [],
    readingLog: [],
    wantToRead: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAllData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Load all data in parallel from unified media API
      const [
        booksResponse,
        audiobooksResponse,
        blogsResponse,
        shortStoriesResponse,
        verseResponse,
        essaysResponse,
        papersResponse,
        readingLogResponse,
        wantToReadResponse
      ] = await Promise.all([
        fetch('/api/media?source=reading&type=books'),
        fetch('/api/media?source=reading&type=audiobooks'),
        fetch('/api/media?source=reading&type=blogs'),
        fetch('/api/media?source=reading&type=short-stories'),
        fetch('/api/media?source=reading&type=verse'),
        fetch('/api/media?source=reading&type=essays'),
        fetch('/api/media?source=reading&type=papers'),
        fetch('/api/media?source=reading&type=log'),
        fetch('/api/media?source=reading&type=want-to-read')
      ])

      // Check for any failed requests
      if (!booksResponse.ok || !audiobooksResponse.ok || !blogsResponse.ok || !shortStoriesResponse.ok || 
          !verseResponse.ok || !essaysResponse.ok || !papersResponse.ok || 
          !readingLogResponse.ok || !wantToReadResponse.ok) {
        throw new Error('Failed to load some reading data')
      }

      // Parse all responses in parallel
      const [
        booksData,
        audiobooksData,
        blogsData,
        shortStoriesData,
        verseData,
        essaysData,
        papersData,
        readingLogData,
        wantToReadData
      ] = await Promise.all([
        booksResponse.json(),
        audiobooksResponse.json(),
        blogsResponse.json(),
        shortStoriesResponse.json(),
        verseResponse.json(),
        essaysResponse.json(),
        papersResponse.json(),
        readingLogResponse.json(),
        wantToReadResponse.json()
      ])

      // Update state with all the loaded data (unified API response format)
      setData({
        books: booksData.books || [],
        audiobooks: audiobooksData.audiobooks || [],
        blogPosts: blogsData.blogs || [],
        shortStories: shortStoriesData.stories || [],
        verse: verseData.verse || [],
        essays: essaysData.essays || [],
        papers: papersData.papers || [],
        readingLog: readingLogData.log || [],
        wantToRead: wantToReadData.wantToRead || []
      })

    } catch (err) {
      console.error('Error loading reading data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load reading data')
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
    <ReadingDataContext.Provider value={value}>
      {children}
    </ReadingDataContext.Provider>
  )
}
