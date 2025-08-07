"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface ReadingPaper {
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
  const router = useRouter()

  useEffect(() => {
    // Only fetch if no data was provided
    if (!data) {
      const loadPapers = async () => {
        try {
          const response = await fetch('/api/reading/papers')
          const responseData = await response.json()
          setPapers(responseData['papers'] || [])
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

  if (!papers.length) {
    return <p className="text-center py-10 text-muted-foreground">No papers found.</p>
  }

  return (
    <div className="mt-4">
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Title</th>
            <th className="py-2 text-left font-medium px-3">Author</th>
            <th className="py-2 text-left font-medium px-3">Publication Year</th>
          </tr>
        </thead>
        <tbody>
          {papers.map((paper, index) => (
            <tr
              key={index}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(`/reading/papers/${createSlug(paper.title)}`)}
            >
              <td className="py-2 px-3">{paper.title}</td>
              <td className="py-2 px-3">{paper.author}</td>
              <td className="py-2 px-3">{paper.publication_year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
