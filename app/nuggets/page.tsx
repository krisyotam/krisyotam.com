"use client"

import { useState } from "react"
import { Nuggets, type NuggetData, type NuggetSource } from "@/components/nuggets"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { HelpCircle, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import nuggetsData from "@/data/nuggets.json"

export const dynamic = "force-dynamic"

export default function NuggetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSource, setActiveSource] = useState<NuggetSource | "All">("All")

  // Extract all unique source types
  const sourceTypes = Array.from(
    new Set(nuggetsData.nuggets.map((nugget: NuggetData) => nugget.source.type)),
  ) as NuggetSource[]

  // Filter nuggets based on search query and active source
  const filteredNuggets = nuggetsData.nuggets.filter((nugget: NuggetData) => {
    const matchesSearch =
      searchQuery === "" ||
      nugget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nugget.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSource = activeSource === "All" || nugget.source.type === activeSource

    return matchesSearch && matchesSource
  })

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search nuggets by title or content..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Source Types Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            key="source-all"
            variant={activeSource === "All" ? "default" : "secondary"}
            onClick={() => setActiveSource("All")}
            className="text-sm"
          >
            All
          </Button>

          {sourceTypes.map((source) => (
            <Button
              key={`source-${source}`}
              variant={activeSource === source ? "default" : "secondary"}
              onClick={() => setActiveSource(source)}
              className="text-sm"
            >
              {source}
            </Button>
          ))}
        </div>

        {/* Nuggets List */}
        {filteredNuggets.length > 0 ? (
          <Nuggets data={filteredNuggets} />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No nuggets found matching your criteria.</p>
          </div>
        )}

        {/* Help Button */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 left-4 rounded-full shadow-lg hover:shadow-xl"
              onClick={() => setIsModalOpen(true)}
            >
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Help</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About Knowledge Nuggets</DialogTitle>
              <DialogDescription>
                Knowledge Nuggets are bite-sized insights, ideas, and thoughts I've collected from various platforms
                across the web. These represent interesting concepts, theories, and perspectives that I find worth
                preserving and sharing.
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Search for specific topics using the search bar</li>
                  <li>Filter by source platform using the buttons above</li>
                  <li>Each nugget includes a link to the original source</li>
                  <li>Some nuggets may contain mathematical formulas rendered with LaTeX</li>
                </ul>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

