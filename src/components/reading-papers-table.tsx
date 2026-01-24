"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface ReadingPaper {
  title: string
  author: string[]
  source_link: string
  archive_link: string
  publication_year: number
}

interface ReadingPapersTableProps {
  data?: ReadingPaper[]
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function ReadingPapersTable({ data }: ReadingPapersTableProps) {
  const [papers, setPapers] = useState<ReadingPaper[]>(data || [])
  const [loading, setLoading] = useState(!data)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Only fetch if no data was provided
    if (!data) {
      const loadPapers = async () => {
        try {
          const response = await fetch('/api/media?source=reading&type=papers')
          const responseData = await response.json()
          setPapers(responseData.papers || [])
        } catch (error) {
          console.error('Error loading papers:', error)
          setPapers([])
        } finally {
          setLoading(false)
        }
      }

      loadPapers()
    } else {
      // Use provided data immediately
      setPapers(data)
      setLoading(false)
    }
  }, [data])

  // Filter papers based on search query
  const filteredPapers = papers.filter((paper) => {
    const q = searchQuery.toLowerCase()
    return (
      !q ||
      paper.title.toLowerCase().includes(q) ||
      paper.author.some(author => author.toLowerCase().includes(q))
    )
  })

  // Helper to format authors display
  const formatAuthors = (authors: string[]) => {
    if (!authors || authors.length === 0) return 'Unknown Author'
    if (authors.length === 1) return authors[0]
    
    return (
      <span className="flex items-center gap-1">
        {authors[0]} et al.
        <span 
          className="inline-flex items-center justify-center w-3 h-3 text-xs rounded-full bg-muted text-muted-foreground cursor-help border"
          title={authors.join(', ')}
        >
          i
        </span>
      </span>
    )
  }

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
          placeholder="Search papers..." 
          className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
      </div>

      {filteredPapers.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground">
          {searchQuery ? 'No papers found matching your search.' : 'No papers found.'}
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
            {filteredPapers.slice().reverse().map((paper, index) => (
              <tr
                key={index}
                className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                  paper.source_link ? 'cursor-pointer' : ''
                } ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
                }`}
                onClick={() => {
                  console.log('Paper clicked:', paper.title, 'Link:', paper.source_link);
                  if (paper.source_link) {
                    const url = paper.source_link.startsWith('http')
                      ? paper.source_link
                      : `https://${paper.source_link}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <td className="py-2 px-3">{paper.title}</td>
                <td className="py-2 px-3">{formatAuthors(paper.author)}</td>
                <td className="py-2 px-3">{paper.publication_year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}