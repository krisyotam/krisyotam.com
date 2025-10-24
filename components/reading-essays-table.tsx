"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface ReadingEssay {
  title: string
  author: string
  source_link: string
  archive_link: string
  publication_year: number
}

interface ReadingEssaysTableProps {
  data?: ReadingEssay[]
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function ReadingEssaysTable({ data }: ReadingEssaysTableProps) {
  const [essays, setEssays] = useState<ReadingEssay[]>(data || [])
  const [loading, setLoading] = useState(!data)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Only fetch if no data was provided
    if (!data) {
      const loadEssays = async () => {
        try {
          const response = await fetch('/api/reading/essays')
          const responseData = await response.json()
          setEssays(responseData['essays'] || [])
        } catch (error) {
          console.error('Error loading essays:', error)
          setEssays([])
        } finally {
          setLoading(false)
        }
      }

      loadEssays()
    } else {
      // Use provided data immediately
      setEssays(data)
      setLoading(false)
    }
  }, [data])

  // Filter essays based on search query
  const filteredEssays = essays.filter((essay) => {
    const q = searchQuery.toLowerCase()
    return (
      !q ||
      essay.title.toLowerCase().includes(q) ||
      essay.author.toLowerCase().includes(q)
    )
  })

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    if (!dateString) return 'No date available'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'
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
          placeholder="Search essays..." 
          className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
      </div>

      {filteredEssays.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground">
          {searchQuery ? 'No essays found matching your search.' : 'No essays found.'}
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
            {filteredEssays.slice().reverse().map((essay, index) => (
              <tr
                key={index}
                className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                  essay.source_link ? 'cursor-pointer' : ''
                } ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
                }`}
                onClick={() => {
                  console.log('Essay clicked:', essay.title, 'Link:', essay.source_link);
                  if (essay.source_link) {
                    const url = essay.source_link.startsWith('http')
                      ? essay.source_link
                      : `https://${essay.source_link}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <td className="py-2 px-3">{essay.title}</td>
                <td className="py-2 px-3">{essay.author}</td>
                <td className="py-2 px-3">{essay.publication_year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}