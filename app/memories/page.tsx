"use client"

import { useState, useEffect } from "react"
import { MemoryCard, type Memory } from "@/components/memory-card"
import { MemoryModal } from "@/components/memory-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, HelpCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/page-header"

// Import the memories data directly
import memoriesData from "@/data/memories.json"

// Add memories page metadata after the other imports
const memoriesPageData = {
  title: "Memories",
  subtitle: "Collected Thoughts and Discoveries",
  date: new Date().toISOString(),
  preview: "A digital repository of interesting discoveries on the interwebs.",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 6,
}

export default function MemoriesPage() {
  // State for data
  const [memories, setMemories] = useState<Memory[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // State for UI
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>([])

  // State for modal
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // Load memories data
  useEffect(() => {
    try {
      // Load memories directly from the imported JSON
      console.log("Loading memories from imported JSON file")

      if (!memoriesData || !memoriesData.memories || !Array.isArray(memoriesData.memories)) {
        throw new Error("Invalid memories data format")
      }

      // Extract unique categories from memories
      const uniqueCategories = Array.from(new Set(memoriesData.memories.map((memory) => memory.category)))

      setMemories(memoriesData.memories)
      setCategories(uniqueCategories)
      setFilteredMemories(memoriesData.memories)
    } catch (error) {
      console.error("Error loading memories:", error)
      setError(typeof error === "string" ? error : error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  // Filter memories based on search and category
  useEffect(() => {
    if (memories.length === 0) return

    let filtered = [...memories]

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter((memory) => memory.category === activeCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (memory) =>
          memory.title.toLowerCase().includes(query) ||
          memory.description.toLowerCase().includes(query) ||
          memory.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    setFilteredMemories(filtered)
  }, [memories, searchQuery, activeCategory])

  // Handle memory selection for modal
  const handleViewMemory = (memory: Memory) => {
    setSelectedMemory(memory)
    setIsModalOpen(true)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Render main content
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        {/* Add the PageHeader component */}
        <PageHeader
          title={memoriesPageData.title}
          subtitle={memoriesPageData.subtitle}
          date={memoriesPageData.date}
          preview={memoriesPageData.preview}
          status={memoriesPageData.status}
          confidence={memoriesPageData.confidence}
          importance={memoriesPageData.importance}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search Memories..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            key="category-all"
            variant={activeCategory === "All" ? "default" : "secondary"}
            onClick={() => setActiveCategory("All")}
            className="text-sm"
          >
            All
          </Button>

          {categories.map((category) => (
            <Button
              key={`category-${category}`}
              variant={activeCategory === category ? "default" : "secondary"}
              onClick={() => setActiveCategory(category)}
              className="text-sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Memories Grid */}
        {filteredMemories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredMemories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} onViewDetails={handleViewMemory} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No items found matching your criteria.</p>
          </div>
        )}

        {/* Help Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 left-4 rounded-full shadow-lg hover:shadow-xl"
            >
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Help</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About Memories</DialogTitle>
              <DialogDescription>
                This page is my digital repository of interesting discoveries, research notes, and intellectual
                curiosities that I want to remember and potentially explore further.
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Search for specific items using the search bar</li>
                  <li>Filter by category using the buttons above</li>
                  <li>Click on &quot;View Details&quot; to read the full notes</li>
                </ul>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Memory Modal */}
        <MemoryModal memory={selectedMemory} isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </div>
  )
}

