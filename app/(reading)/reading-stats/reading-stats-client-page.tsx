"use client"

import { useState, useEffect } from "react"

interface ReadingLogEntry {
  title: string
  author: string
  type: string
  genre: string
  sub_genre: string[]
  word_count: number | string
  page_count?: number
  reads: {
    start: string
    end: string | null
    log: [string, number | null, number][]
  }[]
}

interface ReadingLogData {
  "reading-log": ReadingLogEntry[]
}

interface DailyStats {
  date: string
  minutes: number
  pages: number
}

interface TypeStats {
  type: string
  minutes: number
  pages: number
  count: number
}

interface AuthorStats {
  author: string
  minutes: number
  pages: number
  titles: number
}

export function ReadingStatsClient() {
  const [data, setData] = useState<ReadingLogData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/reading/reading-log')
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error('Failed to fetch reading log:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return null
  }

  if (!data || !data["reading-log"]) {
    return <div>No reading log data available.</div>
  }

  // Calculate daily stats
  const dailyStats = new Map<string, { minutes: number; pages: number }>()
  
  data["reading-log"].forEach(entry => {
    entry.reads.forEach(readSession => {
      readSession.log.forEach(logEntry => {
        const date = logEntry[0]
        const pages = logEntry[1] || 0
        const minutes = logEntry[2]
        
        const existing = dailyStats.get(date) || { minutes: 0, pages: 0 }
        dailyStats.set(date, {
          minutes: existing.minutes + minutes,
          pages: existing.pages + pages
        })
      })
    })
  })

  // Calculate type stats
  const typeStats = new Map<string, { minutes: number; pages: number; count: number }>()
  
  data["reading-log"].forEach(entry => {
    const totalMinutes = entry.reads.reduce((sum, readSession) => 
      sum + readSession.log.reduce((logSum, logEntry) => logSum + logEntry[2], 0), 0)
    const totalPages = entry.reads.reduce((sum, readSession) => 
      sum + readSession.log.reduce((logSum, logEntry) => logSum + (logEntry[1] || 0), 0), 0)

    const existing = typeStats.get(entry.type) || { minutes: 0, pages: 0, count: 0 }
    typeStats.set(entry.type, {
      minutes: existing.minutes + totalMinutes,
      pages: existing.pages + totalPages,
      count: existing.count + 1
    })
  })

  // Calculate author stats
  const authorStats = new Map<string, { minutes: number; pages: number; titles: number }>()
  
  data["reading-log"].forEach(entry => {
    const totalMinutes = entry.reads.reduce((sum, readSession) => 
      sum + readSession.log.reduce((logSum, logEntry) => logSum + logEntry[2], 0), 0)
    const totalPages = entry.reads.reduce((sum, readSession) => 
      sum + readSession.log.reduce((logSum, logEntry) => logSum + (logEntry[1] || 0), 0), 0)

    const existing = authorStats.get(entry.author) || { minutes: 0, pages: 0, titles: 0 }
    authorStats.set(entry.author, {
      minutes: existing.minutes + totalMinutes,
      pages: existing.pages + totalPages,
      titles: existing.titles + 1
    })
  })

  // Sort and convert to arrays
  const sortedDailyStats = Array.from(dailyStats.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const sortedTypeStats = Array.from(typeStats.entries())
    .map(([type, stats]) => ({ type, ...stats }))
    .sort((a, b) => b.minutes - a.minutes)

  const sortedAuthorStats = Array.from(authorStats.entries())
    .map(([author, stats]) => ({ author, ...stats }))
    .sort((a, b) => b.minutes - a.minutes)

  // Calculate totals
  const totalMinutes = sortedDailyStats.reduce((sum, day) => sum + day.minutes, 0)
  const totalPages = sortedDailyStats.reduce((sum, day) => sum + day.pages, 0)
  const totalDays = sortedDailyStats.length
  const avgMinutesPerDay = totalDays > 0 ? Math.round(totalMinutes / totalDays) : 0

  return (
    <div className="mt-4 space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-muted/50">
          <div className="text-2xl font-bold">{totalMinutes}</div>
          <div className="text-sm text-muted-foreground">Total Minutes</div>
        </div>
        <div className="p-6 bg-muted/50">
          <div className="text-2xl font-bold">{totalPages}</div>
          <div className="text-sm text-muted-foreground">Total Pages</div>
        </div>
        <div className="p-6 bg-muted/50">
          <div className="text-2xl font-bold">{totalDays}</div>
          <div className="text-sm text-muted-foreground">Reading Days</div>
        </div>
        <div className="p-6 bg-muted/50">
          <div className="text-2xl font-bold">{avgMinutesPerDay}</div>
          <div className="text-sm text-muted-foreground">Avg Min/Day</div>
        </div>
      </div>

      {/* Daily Reading Chart */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Daily Reading Activity</h3>
        <div className="p-4 bg-muted/50 overflow-x-auto">
          <div className="flex items-end space-x-1 min-w-max" style={{ height: '200px' }}>
            {sortedDailyStats.map((day, index) => {
              const maxMinutes = Math.max(...sortedDailyStats.map(d => d.minutes))
              const height = maxMinutes > 0 ? (day.minutes / maxMinutes) * 160 : 0
              
              return (
                <div key={index} className="flex flex-col items-center space-y-1">
                  <div 
                    className="bg-primary"
                    style={{ 
                      height: `${height}px`,
                      width: '20px',
                      minHeight: day.minutes > 0 ? '2px' : '0px'
                    }}
                    title={`${day.date}: ${day.minutes} minutes`}
                  />
                  <div className="text-xs text-muted-foreground transform -rotate-45 origin-center w-8">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Reading by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Reading by Type</h3>
          <div className="space-y-3">
            {sortedTypeStats.map((stat, index) => {
              const maxMinutes = Math.max(...sortedTypeStats.map(s => s.minutes))
              const percentage = maxMinutes > 0 ? (stat.minutes / maxMinutes) * 100 : 0
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{stat.type}</span>
                    <span className="text-muted-foreground">{stat.minutes} min</span>
                  </div>
                  <div className="h-2 bg-muted">
                    <div 
                      className="h-2 bg-primary"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{stat.count} titles</span>
                    <span>{stat.pages} pages</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Reading by Author */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Reading by Author</h3>
          <div className="space-y-3">
            {sortedAuthorStats.map((stat, index) => {
              const maxMinutes = Math.max(...sortedAuthorStats.map(s => s.minutes))
              const percentage = maxMinutes > 0 ? (stat.minutes / maxMinutes) * 100 : 0
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="truncate">{stat.author}</span>
                    <span className="text-muted-foreground">{stat.minutes} min</span>
                  </div>
                  <div className="h-2 bg-muted">
                    <div 
                      className="h-2 bg-secondary"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{stat.titles} titles</span>
                    <span>{stat.pages} pages</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
