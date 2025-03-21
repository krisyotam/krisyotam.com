"use client"

import { useState, useEffect } from "react"

type TextEntry = {
  id: string
  date: string
  text: string
}

export default function TextFeed({ entries }: { entries: TextEntry[] }) {
  const [sortedEntries, setSortedEntries] = useState<TextEntry[]>([])

  useEffect(() => {
    // Sort entries by date, newest first
    const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setSortedEntries(sorted)
  }, [entries])

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {sortedEntries.map((entry) => {
        const formattedDate = new Date(entry.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })

        return (
          <div key={entry.id} className="border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Update</h3>
              <time className="text-sm text-muted-foreground">{formattedDate}</time>
            </div>
            <p className="whitespace-pre-line">{entry.text}</p>
          </div>
        )
      })}
    </div>
  )
}

