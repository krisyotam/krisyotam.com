"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LibraryBookCard } from "./library-book-card"
import { Book } from "@/types/library"

export function LibrarySeriesContent() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSeries, setSelectedSeries] = useState("all")
  const [availableSeries, setAvailableSeries] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch("/api/library-catalog")
        const data = await response.json()

        if (Array.isArray(data)) {
          setBooks(data)
          
          // Extract unique series, filtering out empty ones
          const series = [...new Set(data
            .map((book) => book.series)
            .filter((series) => series && series.trim() !== "")
          )].sort()
          setAvailableSeries(series)
        } else {
          console.error("Unexpected data format:", data)
          setError("Received invalid data format from API")
          setBooks([])
        }
      } catch (error) {
        console.error("Error fetching library catalog:", error)
        setError("Failed to load library catalog")
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  // Filter books by selected series
  const filteredBooks = books.filter((book) => {
    if (selectedSeries === "all") return book.series && book.series.trim() !== ""
    return book.series === selectedSeries
  })

  // Group books by series for display
  const booksBySeries = filteredBooks.reduce((acc, book) => {
    const series = book.series || "No Series"
    if (!acc[series]) {
      acc[series] = []
    }
    acc[series].push(book)
    return acc
  }, {} as Record<string, Book[]>)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <svg className="animate-spin h-8 w-8 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    )
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>
  }

  if (books.length === 0) {
    return <div className="py-8 text-center">No books found in your catalog.</div>
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <label htmlFor="series-filter" className="text-sm text-muted-foreground">Series:</label>
          <select
            id="series-filter"
            className="border rounded px-2 py-1 text-sm bg-background"
            value={selectedSeries}
            onChange={(e) => setSelectedSeries(e.target.value)}
          >
            <option value="all">All Series</option>
            {availableSeries.map(series => (
              <option key={series} value={series}>{series}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="py-8 text-center">No books found for the selected series.</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(booksBySeries).map(([series, seriesBooks]) => (
            <div key={series} className="space-y-4">
              {selectedSeries === "all" && (
                <h3 className="text-lg font-semibold border-b border-border pb-2">
                  {series} ({seriesBooks.length} book{seriesBooks.length !== 1 ? 's' : ''})
                </h3>
              )}
              <div className="grid grid-cols-1 gap-4">
                {seriesBooks.map((book) => {
                  const bookSlug = book.title.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim()
                  
                  return (
                    <LibraryBookCard
                      key={book.id}
                      coverUrl={book.coverUrl || "/placeholder.svg?height=100&width=100"}
                      title={book.title}
                      author={book.authorName || book.authorNames?.join(", ") || "Unknown Author"}
                      rating={0}
                      subtitle={`${book.classification} - ${book.subClassification}`}
                      onClick={() => {
                        router.push(`/library/${book.classification}/${book.subClassification}/${bookSlug}`)
                      }}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


