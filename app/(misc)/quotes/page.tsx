"use client"

import { useState, useEffect, useMemo } from "react"
import { QuoteCard } from "@/components/quote-card"
import quotesData from "@/data/quotes.json"
import { PageHeader } from "@/components/core"
import { PageDescription } from "@/components/core"

// Add Quotes page metadata after other imports
const quotesPageData = {
  title: "Quotes",
  subtitle: "Notable Sayings and Excerpts",
  start_date: "2025-10-06",
  end_date: new Date().toISOString(),
  preview: "A collection of notable quotes, excerpts, and sayings from literature, films, and conversations that resonate personally",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 7,
}

export const dynamic = "force-dynamic"

export default function QuotesPage() {
  // quotes entries have { text, author, source }
  // Shuffle quotes for randomized order once on mount (client-side)
  const [quotes, setQuotes] = useState(() => [...(quotesData.quotes || [])])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const arr = [...quotes]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = arr[i]
      arr[i] = arr[j]
      arr[j] = tmp
    }
    setQuotes(arr)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filter by author or text (case-insensitive)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return quotes
    return quotes.filter((item) => {
      const author = (item.author || "").toLowerCase()
      const text = (item.text || "").toLowerCase()
      return author.includes(q) || text.includes(q)
    })
  }, [quotes, search])

  return (
    <div className="relative min-h-screen bg-background text-foreground">
  <div className="max-w-4xl mx-auto p-6 md:p-12 lg:p-16">
        {/* Add the PageHeader component */}
        <PageHeader
          title={quotesPageData.title}
          subtitle={quotesPageData.subtitle}
          start_date={quotesPageData.start_date}
          preview={quotesPageData.preview}
          status={quotesPageData.status}
          confidence={quotesPageData.confidence}
          importance={quotesPageData.importance}
        />

        <div className="mb-6">
          <label htmlFor="quote-search" className="sr-only">Search quotes</label>
          <div className="flex gap-2"> 
            <input
              id="quote-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by author or text..."
              className="w-full rounded-none border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {search ? (
              <button
                onClick={() => setSearch("")}
                className="px-3 py-2 text-sm border border-border rounded-none bg-muted/5"
                aria-label="Clear search"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filtered.map((quote, idx) => (
            <QuoteCard
              key={quote.text + (quote.author || '') + idx}
              text={quote.text}
              author={quote.author}
              source={quote.source}
            />
          ))}
        </div>
      </div>
      
      {/* PageDescription component */}
      <PageDescription
        title="About this collection"
        description={`This is a personally curated collection of quotes drawn from literature I've read, films I've watched, and people I've talked to. Each quote has personal resonance — they mean something internally to me rather than being a neutral compilation.`}
      />
    </div>
  )
}

