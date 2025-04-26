"use client"

import { useState } from "react"
import { NotesSearch } from "@/components/notes-search"
import { NotesCategoryFilter } from "@/components/notes-category-filter"
import { NotesList } from "@/components/notes-list"
import { HelpCircle, X } from "lucide-react"
import { PageHeader } from "@/components/page-header"

// Add Notes page metadata after other imports
const notesPageData = {
  title: "Notes",
  subtitle: "",
  date: new Date().toISOString(),
  preview: "Misc thoughts, memories, proto-essays, musings, etc.",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 6,
}

interface Note {
  title: string
  date: string
  slug: string
  tags: string[]
  category: string
  content: string
}

interface NotesClientPageProps {
  notes: Note[]
}

export default function NotesClientPage({ notes }: NotesClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [showHelp, setShowHelp] = useState(false)

  // Extract unique categories from notes
  const categories = ["all", ...Array.from(new Set(notes.map((note) => note.category)))]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category)
  }

  return (
    <>
      <style jsx global>{`
        .notes-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>
      <div className="notes-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        {/* Add the PageHeader component */}
        <PageHeader
          title={notesPageData.title}
          subtitle={notesPageData.subtitle}
          date={notesPageData.date}
          preview={notesPageData.preview}
          status={notesPageData.status}
          confidence={notesPageData.confidence}
          importance={notesPageData.importance}
        />

        <NotesSearch onSearch={handleSearch} />

        <NotesCategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategorySelect={handleCategorySelect}
        />

        <NotesList notes={notes} searchQuery={searchQuery} activeCategory={activeCategory} />

        {/* Help icon in bottom left */}
        <div className="fixed bottom-4 left-4 z-10">
          <button
            onClick={() => setShowHelp(true)}
            className="p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors"
            aria-label="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Help modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">About Notes</h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <p>This is my notes section where I jot down quick thoughts, ideas, and observations.</p>
                <p>
                  Use the search bar to find specific notes by title, tag, or category. You can also filter notes by
                  category using the buttons below the search bar.
                </p>
                <p>Notes support LaTeX for mathematical expressions, both inline ($...$) and block ($$...$$).</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

