"use client"

import { useEffect, useState } from "react"
import { KeynoteCard } from "../../components/keynote-card"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

interface Keynote {
  id: string
  img: string
  title: string
  subtitle: string
  keynote_pdf: string
  keynote_pptx: string
  date: string
  authors: string
  category: string
}

const KeynotesPage = () => {
  const [keynotes, setKeynotes] = useState<Keynote[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchKeynotes = async () => {
      try {
        const response = await fetch("/api/keynotes")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: Keynote[] = await response.json()
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format")
        }
        setKeynotes(data)

        // Extract unique categories
        const uniqueCategories = ["All", ...new Set(data.map((keynote) => keynote.category))]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Error fetching keynotes data:", error)
        setKeynotes([])
        setCategories(["All"])
      } finally {
        setLoading(false)
      }
    }

    fetchKeynotes()
  }, [])

  const filteredKeynotes =
    selectedCategory === "All" ? keynotes : keynotes.filter((keynote) => keynote.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <p className="text-lg">Loading keynotes...</p>
      </div>
    )
  }

  if (keynotes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <p className="text-lg">No keynotes available. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className={`transition-colors hover:bg-primary hover:text-primary-foreground ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6">
            {filteredKeynotes.map((keynote) => (
              <KeynoteCard
                key={keynote.id}
                img={keynote.img}
                title={keynote.title}
                subtitle={keynote.subtitle}
                keynoteLink={keynote.keynote_pdf}
                pptLink={keynote.keynote_pptx}
                date={keynote.date}
                author={keynote.authors}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default KeynotesPage

