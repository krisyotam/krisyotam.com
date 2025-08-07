"use client"

import { useState, useEffect } from "react"
import { useReadingData } from "@/contexts/reading-data-context"

interface ReadingLogEntry {
  title: string
  author: string
  type: string
  genre: string
  sub_genre: string[]
  word_count: number
  page_count?: number
  reads: {
    start: string
    end: string | null
    log: [string, number | null, number][] // [date, pages_read, minutes_spent]
  }[]
}

interface DailyLogEntry {
  date: string
  title: string
  author: string
  type: string
  pages: number | null
  minutes: number
  status: 'completed' | 'in-progress'
  readNumber: number
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

  // Flatten all log entries and sort by date (most recent first)
  const dailyEntries: DailyLogEntry[] = []
  
  data.forEach((book) => {
    book.reads.forEach((read, readIndex) => {
      const isCompleted = read.end !== null
      
      read.log.forEach(([date, pages, minutes]) => {
        dailyEntries.push({
          date,
          title: book.title,
          author: book.author,
          type: book.type,
          pages,
          minutes,
          status: isCompleted ? 'completed' : 'in-progress',
          readNumber: readIndex + 1
        })
      })
    })
  })

  // Sort by date descending (most recent first)
  dailyEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      if (remainingMinutes === 0) {
        return `${hours}h`
      }
      return `${hours}h ${remainingMinutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="text-left py-3 px-4 font-medium">Date</th>
              <th className="text-left py-3 px-4 font-medium">Title</th>
              <th className="text-left py-3 px-4 font-medium">Author</th>
              <th className="text-left py-3 px-4 font-medium">Type</th>
              <th className="text-left py-3 px-4 font-medium">Minutes</th>
            </tr>
          </thead>
          <tbody>
            {dailyEntries.map((entry, index) => (
              <tr key={`${entry.date}-${entry.title}-${index}`} className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="py-3 px-4 font-mono text-sm">
                  {formatDate(entry.date)}
                </td>
                <td className="py-3 px-4">
                  {entry.title}
                  {entry.readNumber > 1 && (
                    <span className="ml-1 text-xs">(Read #{entry.readNumber})</span>
                  )}
                </td>
                <td className="py-3 px-4">{entry.author}</td>
                <td className="py-3 px-4">{entry.type}</td>
                <td className="py-3 px-4 font-mono">
                  {formatTime(entry.minutes)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
