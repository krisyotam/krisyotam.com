"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { formatDate } from "@/utils/date-formatter"

type Note = {
  id: string
  date: string
  title: string
  content: string
}

export function LibraryNotesContent() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await fetch("/api/library-notes")
        const data = await response.json()

        if (data && Array.isArray(data.notes)) {
          setNotes(data.notes)
        } else if (Array.isArray(data)) {
          setNotes(data)
        } else {
          console.error("Unexpected data format:", data)
          setError("Received invalid data format from API")
          setNotes([])
        }
      } catch (error) {
        console.error("Error fetching notes:", error)
        setError("Failed to load notes")
        setNotes([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [])

  if (loading) {
    return <div className="py-8 text-center">Loading notes...</div>
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>
  }

  if (notes.length === 0) {
    return <div className="py-8 text-center">No notes found.</div>
  }

  return (
    <div className="grid grid-cols-1 gap-4 py-4">
      {notes.map((note) => (
        <Card key={note.id} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{note.title}</h3>
            <span className="text-xs text-muted-foreground">{formatDate(new Date(note.date))}</span>
          </div>
          <p className="text-sm text-muted-foreground">{note.content}</p>
        </Card>
      ))}
    </div>
  )
}

