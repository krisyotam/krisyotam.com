"use client"

import { useEffect, useState } from "react"
import { SpeechCard } from "../../components/speech-card"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

interface Speech {
  id: string
  img: string
  title: string
  subtitle: string
  speech_pdf: string
  speech_docx: string
  description: string
  date: string
  authors: string
  category: string
}

const SpeechesPage = () => {
  const [speeches, setSpeeches] = useState<Speech[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSpeeches = async () => {
      try {
        const response = await fetch("/api/speeches")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: Speech[] = await response.json()
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format")
        }
        setSpeeches(data)
        // Extract unique categories
        const uniqueCategories = ["All", ...Array.from(new Set(data.map((speech) => speech.category)))]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Error fetching speeches data:", error)
        setSpeeches([])
        setCategories(["All"])
      } finally {
        setLoading(false)
      }
    }

    fetchSpeeches()
  }, [])

  const filteredSpeeches =
    selectedCategory === "All" ? speeches : speeches.filter((speech) => speech.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <p className="text-lg">Loading speeches...</p>
      </div>
    )
  }

  if (speeches.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <p className="text-lg">No speeches available. Please try again later.</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredSpeeches.map((speech) => (
              <SpeechCard
                key={speech.id}
                img={speech.img}
                title={speech.title}
                subtitle={speech.subtitle}
                description={speech.description}
                pdfLink={speech.speech_pdf}
                docxLink={speech.speech_docx}
                date={speech.date}
                author={speech.authors}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpeechesPage

