"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { ResearchCard } from "@/components/research-card"
import theoriesData from "@/data/theories.json"
import { Button } from "@/components/ui/button"

// Import the PageHeader component
import { PageHeader } from "@/components/page-header"

// Add theories page metadata after the other imports
const theoriesPageData = {
  title: "Theories",
  subtitle: "Hypotheses and Conceptual Frameworks",
  date: new Date().toISOString(),
  preview: "A collection of my theoretical work, hypotheses, and conceptual frameworks across various disciplines.",
  status: "In Progress" as const,
  confidence: "possible" as const,
  importance: 8,
}

interface Theory {
  id: string
  title: string
  abstract: string
  importance: string
  authors: string[]
  subject: string
  keywords: string[]
  postedBy: string
  postedOn: string
  dateStarted: string
  status: string
  bibliography: string[]
  img: string
  pdfLink: string
  sourceLink: string
  category: string
  tags: string[]
  tier: number
}

export default function TheoriesPage() {
  const [theories, setTheories] = useState<Theory[]>(theoriesData)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [selectedTier, setSelectedTier] = useState<number | null>(null)

  useEffect(() => {
    setCategories(getCategoriesForTier(selectedTier))
    // Check if the user is already authenticated
    const storedAuth = localStorage.getItem("theoriesAuthenticated")
    if (storedAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [selectedTier])

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("/api/verify-theory-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        setIsAuthenticated(true)
        localStorage.setItem("theoriesAuthenticated", "true")
      } else {
        setError("Invalid password. Please try again.")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  const getTiers = () => {
    const tiers = theoriesData.map((theory) => theory.tier)
    return Array.from(new Set(tiers)).sort((a, b) => a - b)
  }

  const getCategoriesForTier = (tier: number | null) => {
    const filteredTheories = tier ? theories.filter((theory) => theory.tier === tier) : theories
    return Array.from(new Set(filteredTheories.map((theory) => theory.category)))
  }

  const filteredTheories = theories.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTier = !selectedTier || item.tier === selectedTier
    const matchesCategory = !selectedCategory || item.category === selectedCategory

    return matchesSearch && matchesTier && matchesCategory
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <form onSubmit={handlePasswordSubmit} className="space-y-4 w-full max-w-md p-8 bg-card rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Enter Password to Access Theories</h1>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <PageHeader
          title={theoriesPageData.title}
          subtitle={theoriesPageData.subtitle}
          date={theoriesPageData.date}
          preview={theoriesPageData.preview}
          status={theoriesPageData.status}
          confidence={theoriesPageData.confidence}
          importance={theoriesPageData.importance}
        />

        <div className="space-y-6">
          <div className="mb-8">
            <div className="space-y-4">
              <Input
                placeholder="Search theories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />

              {/* Tier Filters */}
              <div className="flex flex-wrap gap-2 mt-4 mb-4">
                <button
                  onClick={() => {
                    setSelectedTier(null)
                    setSelectedCategory(null)
                  }}
                  className={`p-2 text-sm rounded-md transition-colors ${
                    selectedTier === null ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  All Tiers
                </button>
                {getTiers().map((tier) => (
                  <button
                    key={tier}
                    onClick={() => {
                      setSelectedTier(tier)
                      setSelectedCategory(null)
                    }}
                    className={`p-2 text-sm rounded-md transition-colors ${
                      selectedTier === tier ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    Tier {tier}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`p-2 text-sm rounded-md transition-colors ${selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`p-2 text-sm rounded-md transition-colors ${selectedCategory === category ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredTheories.length === 0 ? (
            <p className="text-center text-muted-foreground mt-8">No theories found matching your criteria.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTheories.map((item) => (
                <ResearchCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  abstract={item.abstract}
                  importance={item.importance}
                  authors={item.authors}
                  subject={item.subject}
                  keywords={item.keywords}
                  postedBy={item.postedBy}
                  postedOn={item.postedOn}
                  dateStarted={item.dateStarted}
                  status={item.status}
                  bibliography={item.bibliography}
                  img={item.img}
                  pdfLink={item.pdfLink}
                  sourceLink={item.sourceLink}
                  category={item.category}
                  tags={item.tags}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

