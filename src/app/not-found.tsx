/**
 * =============================================================================
 * 404 Not Found Page
 * =============================================================================
 *
 * Custom 404 error page with search functionality and URL suggestions.
 * Uses the 404-suggester script to provide intelligent page recommendations
 * based on the attempted URL.
 *
 * Note: In Next.js App Router, this file must be named `not-found.tsx`.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// =============================================================================
// Components
// =============================================================================

import { Search } from "lucide-react"
import { LiveClock } from "@/components/live-clock"
import { PageHeader } from "@/components/core"
import { Card } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import SiteFooter from "@/components/typography/expanded-footer-block"

// =============================================================================
// URL Suggester Script Loader
// =============================================================================

function useUrlSuggester() {
  useEffect(() => {
    const loadScript = () => {
      const existingScript = document.getElementById("url-suggester-script")
      if (existingScript) {
        existingScript.remove()
      }

      const script = document.createElement("script")
      script.id = "url-suggester-script"
      script.src = `/api/get-script?t=${Date.now()}`
      script.async = true
      document.body.appendChild(script)
    }

    const timer = setTimeout(loadScript, 100)
    return () => clearTimeout(timer)
  }, [])
}

// =============================================================================
// Search Bar Component
// =============================================================================

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
}

function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const query = value.trim()
      if (query) onSearch(query)
    }
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        aria-label="Search site"
        placeholder="Search site..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-9 pl-10 pr-3 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
      />
    </div>
  )
}

// =============================================================================
// Suggestions Card Component
// =============================================================================

function SuggestionsCard() {
  return (
    <Card className="w-full">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-medium">Suggested pages</h3>
        <p className="text-sm text-muted-foreground">Did you mean one of these?</p>
      </div>
      <div id="url-suggestions-container" className="divide-y divide-border" />
    </Card>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export default function NotFound() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  useUrlSuggester()

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8 container max-w-[672px] mx-auto px-4">
          <PageHeader
            title="404 - Page not found"
            preview="We couldn't find the page you requested. Below are a few suggestions that might help you find what you were looking for."
            backText="Home"
            backHref="/"
          />
        </div>

        {/* Main Content */}
        <main className="container max-w-[672px] mx-auto px-4 space-y-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
          />
          <SuggestionsCard />
        </main>

        {/* Footer */}
        <div className="mt-8 container max-w-[672px] mx-auto px-4">
          <SiteFooter lastUpdated={new Date().toISOString().slice(0, 10)} rawMarkdown="" />
          <div className="mt-4">
            <LiveClock />
          </div>
          <Footer />
        </div>

      </div>
    </div>
  )
}
