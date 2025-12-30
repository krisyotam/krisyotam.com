"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Verse {
  title: string
  author: string
  verse_type: string
  source_link: string
  publication_year: number
}

interface VerseTableProps {
  data?: Verse[]
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function VerseTable({ data }: VerseTableProps) {
  const [verses, setVerses] = useState<Verse[]>(data || [])
  const [loading, setLoading] = useState(!data)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Only fetch if no data was provided
    if (!data) {
      const loadVerses = async () => {
        try {
          const response = await fetch('/api/reading/verse')
          const responseData = await response.json()
          setVerses(responseData.verse || [])
        } catch (error) {
          console.error('Error loading verses:', error)
          setVerses([])
        } finally {
          setLoading(false)
        }
      }

      loadVerses()
    } else {
      // Use provided data immediately
      setVerses(data)
      setLoading(false)
    }
  }, [data])

  // Filter verses based on search query
  const filteredVerses = verses.filter((verse) => {
    const q = searchQuery.toLowerCase()
    return (
      !q ||
      verse.title.toLowerCase().includes(q) ||
      verse.author.toLowerCase().includes(q) ||
      (verse.verse_type && verse.verse_type.toLowerCase().includes(q))
    )
  })

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  if (loading) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search verse..."
          className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
      </div>

      {filteredVerses.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground">
          {searchQuery ? 'No verse found matching your search.' : 'No verses found.'}
        </p>
      ) : (
        <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="py-2 text-left font-medium px-3">Title</th>
              <th className="py-2 text-left font-medium px-3">Author</th>
              <th className="py-2 text-left font-medium px-3">Publication Year</th>
            </tr>
          </thead>
          <tbody>
            {filteredVerses.slice().reverse().map((verse, index) => (
              <tr
                key={index}
                className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                  verse.source_link ? 'cursor-pointer' : ''
                } ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
                }`}
                onClick={() => {
                  console.log('Verse clicked:', verse.title, 'Link:', verse.source_link);
                  if (verse.source_link) {
                    const url = verse.source_link.startsWith('http')
                      ? verse.source_link
                      : `https://${verse.source_link}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <td className="py-2 px-3">{verse.title}</td>
                <td className="py-2 px-3">{verse.author}</td>
                <td className="py-2 px-3">{verse.publication_year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
