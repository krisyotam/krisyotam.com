"use client"

import { useState, useEffect } from "react"

interface ReadingLogEntry {
  date: string
  title: string
  author: string
  type: string
  minutes: number
}

interface ReadingLogData {
  "reading-log": ReadingLogEntry[]
}

interface DailyStats {
  date: string
  minutes: number
}

interface TypeStats {
  type: string
  minutes: number
  count: number
}

interface AuthorStats {
  author: string
  minutes: number
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
  const dailyStats = new Map<string, { minutes: number }>()
  
  data["reading-log"].forEach(entry => {
    const existing = dailyStats.get(entry.date) || { minutes: 0 }
    dailyStats.set(entry.date, {
      minutes: existing.minutes + entry.minutes
    })
  })

  // Calculate type stats
  const typeStats = new Map<string, { minutes: number; count: number }>()
  
  data["reading-log"].forEach(entry => {
    const existing = typeStats.get(entry.type) || { minutes: 0, count: 0 }
    typeStats.set(entry.type, {
      minutes: existing.minutes + entry.minutes,
      count: existing.count + 1
    })
  })

  // Calculate author stats
  const authorStats = new Map<string, { minutes: number; titles: Set<string> }>()
  
  data["reading-log"].forEach(entry => {
    const existing = authorStats.get(entry.author) || { minutes: 0, titles: new Set() }
    existing.titles.add(entry.title)
    authorStats.set(entry.author, {
      minutes: existing.minutes + entry.minutes,
      titles: existing.titles
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
    .map(([author, stats]) => ({ author, minutes: stats.minutes, titles: stats.titles.size }))
    .sort((a, b) => b.minutes - a.minutes)

  // Calculate totals
  const totalMinutes = sortedDailyStats.reduce((sum, day) => sum + day.minutes, 0)
  const totalDays = sortedDailyStats.length
  const avgMinutesPerDay = totalDays > 0 ? Math.round(totalMinutes / totalDays) : 0
  const totalEntries = data["reading-log"].length

  return (
    <div className="mt-4 space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-muted/50">
          <div className="text-2xl font-bold">{totalMinutes}</div>
          <div className="text-sm text-muted-foreground">Total Minutes</div>
        </div>
        <div className="p-6 bg-muted/50">
          <div className="text-2xl font-bold">{totalEntries}</div>
          <div className="text-sm text-muted-foreground">Reading Sessions</div>
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
                  <div className="text-xs text-muted-foreground">
                    {stat.count} sessions
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
                  <div className="text-xs text-muted-foreground">
                    {stat.titles} titles
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
