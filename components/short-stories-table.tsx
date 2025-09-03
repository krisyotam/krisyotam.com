"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface ShortStory {
  title: string
  author: string
  publication_year: number
  source_link?: string
}

interface ShortStoriesTableProps {
  data?: ShortStory[]
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function ShortStoriesTable({ data }: ShortStoriesTableProps) {
  const [shortStories, setShortStories] = useState<ShortStory[]>(data || [])
  const [loading, setLoading] = useState(!data)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Only fetch if no data was provided
    if (!data) {
      const loadShortStories = async () => {
        try {
          const response = await fetch('/api/reading/short-stories')
          const responseData = await response.json()
          setShortStories(responseData['short-stories'] || [])
        } catch (error) {
          console.error('Error loading short stories:', error)
          setShortStories([])
        } finally {
          setLoading(false)
        }
      }

      loadShortStories()
    } else {
      // Use provided data immediately
      setShortStories(data)
      setLoading(false)
    }
  }, [data])

  // Filter short stories based on search query
  const filteredShortStories = shortStories.filter((story) => {
    const q = searchQuery.toLowerCase()
    return (
      !q ||
      story.title.toLowerCase().includes(q) ||
      story.author.toLowerCase().includes(q)
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
          placeholder="Search short stories..." 
          className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
      </div>

      {filteredShortStories.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground">
          {searchQuery ? 'No short stories found matching your search.' : 'No short stories found.'}
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
            {filteredShortStories.slice().reverse().map((story, index) => (
              <tr
                key={index}
                className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                  story.source_link ? 'cursor-pointer' : ''
                } ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
                }`}
                onClick={() => {
                  console.log('Short story clicked:', story.title, 'Link:', story.source_link);
                  if (story.source_link) {
                    const url = story.source_link.startsWith('http')
                      ? story.source_link
                      : `https://${story.source_link}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <td className="py-2 px-3">{story.title}</td>
                <td className="py-2 px-3">{story.author}</td>
                <td className="py-2 px-3">{story.publication_year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
