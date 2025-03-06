"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { ResearchCard } from "@/components/research-card"
import researchData from "@/data/research.json" // Import JSON directly
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

interface Research {
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
}

export default function ResearchPage() {
  const [research, setResearch] = useState<Research[]>(researchData) // Set imported data directly
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Extract unique categories and convert Set to Array
    setCategories(Array.from(new Set(researchData.map((item) => item.category))))
  }, [])

  const filteredResearch = research.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !selectedCategory || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen px-4 py-20 bg-background text-foreground">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">

          {/* Search and Filters */}
          <div className="space-y-4">
            <Input
              placeholder="Search research..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />

            {/* Categories Filters */}
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

        {filteredResearch.length === 0 ? (
          <p className="text-center text-muted-foreground mt-8">No research found matching your criteria.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResearch.map((item) => (
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
            <DialogTitle className="text-2xl font-semibold">About Research</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
            This page showcases my research papers, publications, and ongoing projects. Each card provides a summary
            of the research topic, its importance, and links to the full paper and source materials. You can filter by
            category or search for specific topics using the search bar. 
            Any research related to 
            <a href="https://saintkris.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a8a' }} className="hover:text-theology-blue no-underline"> theology</a>, 
            <a href="https://krisphysics.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a8a' }} className="hover:text-theology-blue no-underline"> physics</a>, or 
            <a href="https://krismathblog.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a8a' }} className="hover:text-theology-blue no-underline"> mathematics</a>. 
            can be found at their own respective sites as those are some isolated topics in my life, which my research is more rigirous and of a longer time horizon.
            </DialogDescription>


          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  )
}

