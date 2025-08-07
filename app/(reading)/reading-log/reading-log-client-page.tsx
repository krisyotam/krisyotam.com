"use client"

import { useState, useEffect } from "react"
import { useReadingData } from "@/contexts/reading-data-context"

interface ReadingLogEntry {
  title: string
  author: string
  type: string
  genre: string
  sub_genre: string[]
  word_count: number | string
  page_count?: number
  reads: {
    start_date: string
    finish_date: string | null
  }[]
}

export function ReadingLogClient() {
  const { data: readingData, loading: contextLoading } = useReadingData()
  const [data, setData] = useState<ReadingLogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!contextLoading) {
      setData(readingData.readingLog || [])
      setLoading(false)
    }
  }, [readingData, contextLoading])

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading reading log...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reading log data available.</p>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="text-left py-2 px-3 font-medium">Title</th>
              <th className="text-left py-2 px-3 font-medium">Author</th>
              <th className="text-left py-2 px-3 font-medium">Type</th>
              <th className="text-left py-2 px-3 font-medium">Genre</th>
              <th className="text-left py-2 px-3 font-medium">Word Count</th>
              <th className="text-left py-2 px-3 font-medium">Total Reads</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index} className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="py-2 px-3 font-medium">{entry.title}</td>
                <td className="py-2 px-3 text-muted-foreground">{entry.author}</td>
                <td className="py-2 px-3 text-muted-foreground">{entry.type}</td>
                <td className="py-2 px-3 text-muted-foreground">{entry.genre}</td>
                <td className="py-2 px-3 text-muted-foreground">{entry.word_count}</td>
                <td className="py-2 px-3 text-muted-foreground">{entry.reads ? entry.reads.length : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
