"use client"

import { useState } from "react"
import { format } from "date-fns"

interface HeatmapData {
  date: string
  count: number
}

interface CalendarHeatmapProps {
  data: HeatmapData[]
}

export function CalendarHeatmap({ data }: CalendarHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<HeatmapData | null>(null)

  // Find the maximum count to normalize colors
  const maxCount = Math.max(...data.map((d) => d.count), 1)

  // Group data by month
  const months: { [key: string]: HeatmapData[] } = {}
  data.forEach((day) => {
    const monthKey = day.date.substring(0, 7) // YYYY-MM
    if (!months[monthKey]) {
      months[monthKey] = []
    }
    months[monthKey].push(day)
  })

  // Sort months chronologically
  const sortedMonths = Object.keys(months).sort()

  // Get color intensity based on count
  const getColorIntensity = (count: number) => {
    if (count === 0) return "bg-muted"

    const intensity = Math.min(Math.ceil((count / maxCount) * 5), 5)
    return `bg-primary/[0.${intensity * 2}]`
  }

  return (
    <div className="relative">
      {hoveredDay && (
        <div className="absolute top-0 right-0 bg-popover text-popover-foreground text-xs p-2 rounded shadow-md">
          <div className="font-medium">{format(new Date(hoveredDay.date), "MMM d, yyyy")}</div>
          <div>{hoveredDay.count} tests</div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {sortedMonths.map((month) => (
          <div key={month} className="flex flex-col">
            <div className="text-xs text-muted-foreground mb-1">{format(new Date(month), "MMM")}</div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: new Date(month + "-01").getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="w-3 h-3"></div>
              ))}

              {months[month].map((day) => (
                <div
                  key={day.date}
                  className={`w-3 h-3 rounded-sm ${getColorIntensity(day.count)}`}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

