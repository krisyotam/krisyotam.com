"use client"

import { useEffect, useState } from "react"
// Note: no Next <Script> or Link needed here
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { LiveClock } from "@/components/live-clock"
import SiteFooter from "@/components/typography/expanded-footer-block"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"

interface Quote {
  text: string
  author: string
}

export default function NotFound() {
  // no inline quote here; SiteFooter provides the quote bento lower on the page
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  
  useEffect(() => {
    // Load the 404-suggester script using the /api/get-script API route
    const loadScript = () => {
      // Remove any existing script first to avoid duplicates
      const existingScript = document.getElementById('url-suggester-script')
      if (existingScript) {
        existingScript.remove()
      }

      const script = document.createElement('script')
      script.id = 'url-suggester-script'
      script.src = `/api/get-script?t=${Date.now()}` // Add timestamp to prevent caching
      script.async = true
      script.onerror = (e) => console.error("Failed to load 404-suggester script:", e)
      document.body.appendChild(script)
      console.log("404-suggester script injected into page")
    }

    // Wait a moment for the DOM to fully render
    setTimeout(loadScript, 100)
  }, [])

  return (
    <>
  <div className="min-h-screen bg-background text-foreground pt-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Page header to match regular pages */}
          <div className="mb-8 container max-w-[672px] mx-auto px-4">
            <PageHeader
              title="404 - Page not found"
              preview="We couldn't find the page you requested. Below are a few suggestions that might help you find what you were looking for."
              backText="Home"
              backHref="/"
            />
          </div>

          {/* Main column that matches essay width */}
          <main id="markdownBody" className="container max-w-[672px] mx-auto px-4 space-y-6">
            {/* Search bar (like /read) */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  aria-label="Search site"
                  type="text"
                  placeholder="Search site..."
                  className="w-full h-9 pl-10 pr-3 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const q = searchTerm.trim();
                      if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
                    }
                  }}
                />
              </div>
            </div>

            {/* (No inline quote here; the SiteFooter below provides the footer bento) */}

            {/* URL Suggestions Container - populated by the 404-suggester.js script
                Wrapped in a square-corner bento that looks like a vertical table */}
            <div>
              <Card className="w-full">
                <div className="p-4 border-b border-border">
                  <h3 className="text-lg font-medium">Suggested pages</h3>
                  <p className="text-sm text-muted-foreground">Did you mean one of these?</p>
                </div>
                <div id="url-suggestions-container" className="divide-y divide-border" />
              </Card>
            </div>

            {/* Other Options removed per design — search bar added above */}
          </main>
          {/* Footer and clock like essay pages */}
          <div className="mt-8 container max-w-[672px] mx-auto px-4">
            <SiteFooter lastUpdated={new Date().toISOString().slice(0,10)} rawMarkdown={""} />
            <div className="mt-4">
              <LiveClock />
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}

