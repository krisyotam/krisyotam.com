"use client"

import { useEffect, useState } from "react"
import { KeynoteCard } from "../../components/keynote-card"
import { Button } from "@/components/ui/button"
import mybooksData from "../../data/keynotes.json"  // Import JSON directly

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
  const [keynotes, setKeynotes] = useState<Keynote[]>(mybooksData)  // Set imported data directly
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [loading, setLoading] = useState<boolean>(false) // Loading is not necessary now

  useEffect(() => {
    // Convert Set to Array
    setCategories(["All", ...Array.from(new Set(mybooksData.map((keynote) => keynote.category)))]);
  }, [])

  const filteredKeynotes =
    selectedCategory === "All" ? keynotes : keynotes.filter((keynote) => keynote.category === selectedCategory);

  // Sort keynotes by 'id' in descending order
  const sortedKeynotes = filteredKeynotes.sort((a, b) => parseInt(b.id) - parseInt(a.id));

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className={`transition-colors hover:bg-primary hover:text-primary-foreground ${selectedCategory === category ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6">
            {sortedKeynotes.map((keynote) => (
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
