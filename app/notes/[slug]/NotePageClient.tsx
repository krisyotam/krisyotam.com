"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { formatDate } from "@/utils/date-formatter"
import notesData from "@/data/quick-notes.json"
import { LiveClock } from "@/components/live-clock"
import { LatexRenderer } from "@/components/latex-renderer"

interface PageProps {
  params: { slug: string }
}

export default function NotePageClient({ params }: PageProps) {
  // Sort notes by date (newest first)
  const notes = [...notesData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const note = notes.find((n) => n.slug === params.slug)

  if (!note) {
    notFound()
  }

  // Find previous and next notes
  const noteIndex = notes.findIndex((n) => n.slug === params.slug)
  const prevNote = noteIndex < notes.length - 1 ? notes[noteIndex + 1] : null
  const nextNote = noteIndex > 0 ? notes[noteIndex - 1] : null

  // Format the date
  const date = new Date(note.date)
  const formattedDate = formatDate(date, "MM-dd-yyyy")

  return (
    <>
      <style jsx global>{`
        .note-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>
      <div className="note-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <div className="mb-2">
          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:underline">
              home
            </Link>
            <span className="mx-2">›</span>
            <Link href="/notes" className="hover:underline">
              notes
            </Link>
            <span className="mx-2">›</span>
            <span>{note.title}</span>
          </div>

          <h1 className="text-2xl font-medium mb-1">{note.title}</h1>
          <p className="text-muted-foreground">Published {formattedDate}</p>
        </div>

        <LatexRenderer content={note.content} />

        <div className="border-t border-border pt-6 mt-12">
          <div className="flex justify-between">
            {prevNote && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Previous</div>
                <Link href={`/notes/${prevNote.slug}`} className="hover:underline">
                  {prevNote.title}
                </Link>
              </div>
            )}

            {nextNote && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Next</div>
                <Link href={`/notes/${nextNote.slug}`} className="hover:underline">
                  {nextNote.title}
                </Link>
              </div>
            )}
          </div>
        </div>

        <LiveClock />
      </div>
    </>
  )
}

