"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { ResearchCard } from "@/components/research-card"
import theoriesData from "@/data/theories.json"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"

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
    <main className="min-h-screen px-4 py-20 bg-background text-foreground">
      <div className="max-w-2xl mx-auto">
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
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 left-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-background rounded-lg shadow-2xl border-0">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-semibold">About Theories</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              This page showcases my theoretical work, hypotheses, and conceptual frameworks. Each card provides a
              summary of the theory, its importance, and links to the full paper and source materials. You can filter by
              category or search for specific topics using the search bar. Any theories related to
              <a
                href="https://saintkris.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1e3a8a" }}
                className="hover:text-theology-blue no-underline"
              >
                {" "}
                theology
              </a>
              ,
              <a
                href="https://krisphysics.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1e3a8a" }}
                className="hover:text-theology-blue no-underline"
              >
                {" "}
                physics
              </a>
              , or
              <a
                href="https://krismathblog.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1e3a8a" }}
                className="hover:text-theology-blue no-underline"
              >
                {" "}
                mathematics
              </a>
              . can be found at their own respective sites as those are some isolated topics in my life, 
              in which the knowledge is not interconnected to the research seen here. Another thing you will notice is 
              the elementary tier system in which I have created. The system organizes theories from <strong>Tiers 1 - 5</strong>.
              1 being the largest reserved for high level theories that have several sub theories to prove specific branches of it. 
              5 being the lowest level or more basic theories in which are foundational building blocks for some of the higher level theories.
              Tier makes them no more/less important.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  )
}

