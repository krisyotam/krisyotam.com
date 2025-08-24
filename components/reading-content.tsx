"use client"

import { useState, useEffect, Key } from "react"
import { useQuery } from "@apollo/client"
import { GET_READING_STATES } from "@/lib/queries"
import { ReadingBookCard } from "@/components/reading-book-card"
import { ReadingLists } from "@/components/reading-lists"
import { ReadingSubTabs } from "@/components/reading-sub-tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type ReadingStatus = "IS_READING" | "FINISHED" | "WANTS_TO_READ"
type TabType = ReadingStatus | "LISTS"

interface Author {
  name: string
}

interface Book {
  id: Key | null | undefined
  cover?: string
  title: string
  subtitle?: string
  authors: Author[]
  slug: string
}

interface ReadingState {
  status: string
  book: Book
}

export function ReadingContent() {
  const [activeTab, setActiveTab] = useState<TabType>("IS_READING")
  const { data, loading, error } = useQuery(GET_READING_STATES, {
    onError: (error) => {
      console.error("GraphQL query error:", error)
    },
    onCompleted: (data) => {
      console.log("GraphQL query completed successfully:", data)
    },
  })

  // Log the current state for debugging
  useEffect(() => {
    console.log("Current reading states data:", data)
    console.log("Loading state:", loading)
    console.log("Error state:", error)
  }, [data, loading, error])

  if (loading) return <p className="text-muted-foreground">Loading reading data...</p>

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading reading data</AlertTitle>
        <AlertDescription>
          {error.message}
          <div className="mt-2 text-xs">
            <details>
              <summary>Technical details</summary>
              <pre className="mt-2 whitespace-pre-wrap bg-slate-950 p-2 rounded text-xs">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  const readingStates = data?.myReadingStates || []
  const filteredBooks = readingStates.filter((state: ReadingState) => state.status === activeTab)

  const tabLabels: Record<TabType, string> = {
    IS_READING: "Reading",
    FINISHED: "Read",
    WANTS_TO_READ: "Want to Read",
    LISTS: "Lists",
  }

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="flex border-b border-border">
          {Object.entries(tabLabels).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as TabType)}
              className={`px-4 py-2 text-sm font-medium relative transition-colors ${
                activeTab === tab
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        {activeTab === "LISTS" ? (
          <ReadingLists />
        ) : activeTab === "FINISHED" ? (
          <ReadingSubTabs />
        ) : (
          <>
            {filteredBooks.length > 0 ? (
              <div className="space-y-6">
                {filteredBooks.map((state: ReadingState) => (
                  <ReadingBookCard
                    key={state.book.id}
                    coverUrl={state.book.cover || "/placeholder.svg?height=100&width=100"}
                    title={state.book.title}
                    subtitle={state.book.subtitle || ""}
                    author={state.book.authors.map((a: Author) => a.name).join(", ")}
                    rating={0}
                    onClick={() => window.open(`https://literal.club/book/${state.book.slug}`, "_blank")}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No books in this category yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
