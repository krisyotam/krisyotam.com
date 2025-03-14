"use client"

import { useState } from "react"
import { PoetryCard } from "@/components/poetry"
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
import poemsData from "@/data/poems.json"
import type { Poem } from "@/utils/poems"

export default function PoetryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeType, setActiveType] = useState("All")
  const poems = poemsData as Poem[]

  // Get unique poem types
  const poemTypes = Array.from(new Set(poems.map((poem: Poem) => poem.type)))

  // Filter poems based on search query and active type
  const filteredPoems = poems.filter((poem) => {
    const matchesSearch =
      searchQuery === "" ||
      poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poem.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (poem.collection && poem.collection.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (poem.description && poem.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = activeType === "All" || poem.type === activeType

    return matchesSearch && matchesType
  })

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search poems by title, type, collection..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Types Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            key="type-all"
            variant={activeType === "All" ? "default" : "secondary"}
            onClick={() => setActiveType("All")}
            className="text-sm"
          >
            All
          </Button>

          {poemTypes.map((type) => (
            <Button
              key={`type-${type}`}
              variant={activeType === type ? "default" : "secondary"}
              onClick={() => setActiveType(type)}
              className="text-sm"
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Poems Grid */}
        {filteredPoems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredPoems.map((poem) => (
              <PoetryCard key={poem.id} poem={poem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No poems found matching your criteria.</p>
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
              <DialogTitle>About Poetry</DialogTitle>
              <DialogDescription>
                This page showcases my personal poetry collection. You can browse poems by type, search for specific
                themes or titles, and read the full text of each poem.
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Search for specific poems using the search bar</li>
                  <li>Filter by poem type using the buttons above</li>
                  <li>Click on "Read Poem" to view the full text</li>
                </ul>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

