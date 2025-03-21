"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

interface Note {
  title: string
  date: string
  slug: string
  tags: string[]
  category: string
  content: string
}

interface NotesListProps {
  notes: Note[]
  searchQuery: string
  activeCategory: string
}

export function NotesList({ notes, searchQuery, activeCategory }: NotesListProps) {
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(notes)
  const [groupedNotes, setGroupedNotes] = useState<Record<string, Record<string, Note[]>>>({})

  useEffect(() => {
    // Filter notes based on search query and active category
    const filtered = notes.filter((note) => {
      const matchesSearch =
        searchQuery === "" ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        note.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = activeCategory === "all" || note.category === activeCategory

      return matchesSearch && matchesCategory
    })

    setFilteredNotes(filtered)

    // Group notes by year and month
    const grouped: Record<string, Record<string, Note[]>> = {}

    filtered.forEach((note) => {
      const date = new Date(note.date)
      const year = date.getFullYear().toString()
      const month = date.toLocaleString("default", { month: "long" })

      if (!grouped[year]) {
        grouped[year] = {}
      }

      if (!grouped[year][month]) {
        grouped[year][month] = []
      }

      grouped[year][month].push(note)
    })

    // Sort notes within each month by date (newest first)
    Object.keys(grouped).forEach((year) => {
      Object.keys(grouped[year]).forEach((month) => {
        grouped[year][month].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      })
    })

    setGroupedNotes(grouped)
  }, [notes, searchQuery, activeCategory])

  if (filteredNotes.length === 0) {
    return <p className="text-center py-10">No notes found.</p>
  }

  return (
    <div>
      {Object.keys(groupedNotes)
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => (
          <div key={year}>
            {Object.keys(groupedNotes[year]).map((month) => (
              <div key={`${year}-${month}`} className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-medium">
                    {year} — {month}
                  </div>
                </div>
                <div className="border-t border-border">
                  {groupedNotes[year][month].map((note) => {
                    const date = new Date(note.date)
                    const day = date.getDate()
                    const suffix = getDaySuffix(day)

                    return (
                      <Link
                        href={`/notes/${note.slug}`}
                        key={note.slug}
                        className="block border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-center py-4">
                          <div className="text-foreground">{note.title}</div>
                          <div className="text-muted-foreground">
                            {day}
                            {suffix}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  )
}

// Helper function to get the correct day suffix (st, nd, rd, th)
function getDaySuffix(day: number): string {
  if (day > 3 && day < 21) return "th"
  switch (day % 10) {
    case 1:
      return "st"
    case 2:
      return "nd"
    case 3:
      return "rd"
    default:
      return "th"
  }
}

