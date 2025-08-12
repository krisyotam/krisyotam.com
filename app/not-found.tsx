"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import Script from "next/script"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Search } from "lucide-react"

interface Quote {
  text: string
  author: string
}

export default function NotFound() {
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null)
  
  useEffect(() => {
    // Fetch quotes from the header-quotes.json file
    const fetchQuote = async () => {
      try {
        const response = await fetch('/api/random-quote')
        const data = await response.json()
        setRandomQuote(data)
      } catch (error) {
        console.error("Failed to fetch random quote:", error)
      }
    }
    
    fetchQuote()

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
      <div className="min-h-screen bg-background dark:bg-[#0A0A0A] text-foreground dark:text-zinc-100">
        <div className="max-w-2xl mx-auto p-8 md:p-16 lg:p-24">
          <div className="space-y-8">
            {/* 404 Header */}
            <div className="text-center">
              <h1 className="text-6xl font-semibold mb-2">404</h1>
              <p className="text-xl text-muted-foreground dark:text-zinc-400">Page not found</p>
            </div>
            
            {/* Random Quote Card */}
            {randomQuote && (
              <Card className="p-6 bg-card dark:bg-[#1A1A1A] text-card-foreground dark:text-zinc-100 border-border dark:border-zinc-800">
                <blockquote className="space-y-2">
                  <p className="text-lg italic">&ldquo;{randomQuote.text}&rdquo;</p>
                  <footer className="text-sm text-muted-foreground dark:text-zinc-400">— {randomQuote.author}</footer>
                </blockquote>
              </Card>
            )}
            
            {/* URL Suggestions Container - This will be populated by the 404-suggester.js script */}
            <div id="markdownBody" className="space-y-6">
              {/* Empty div with id for the loading indicator */}
              <div id="url-suggestions-container"></div>
              
              {/* Other Options Section */}
              <section id="other-options" className="space-y-4">
                <h2 className="text-2xl font-semibold">Other Options</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="flex items-center gap-2" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                  </Button>
                  <Link href="/" passHref>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Home
                    </Button>
                  </Link>
                  <Link href="/search" passHref>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

