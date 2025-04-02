"use client"

import { useState, useEffect } from "react"
import { ProgymnasmataCard } from "./progymnasmata-card"
import { ProgymnasmataSearch } from "./progymnasmata-search"
import { ProgymnasmataContentViewer } from "./progymnasmata-content-viewer"
import { ProgymnasmataTypeFilter } from "./progymnasmata-type-filter"

export interface ProgymnasmataEntry {
  title: string
  type: string
  date: string
  description: string
  slug: string
  paragraphs: string[]
}

export function Progymnasmata() {
  const [entries, setEntries] = useState<ProgymnasmataEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<ProgymnasmataEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState<ProgymnasmataEntry | null>(null)
  const [showContentViewer, setShowContentViewer] = useState(false)

  useEffect(() => {
    async function fetchEntries() {
      try {
        const response = await fetch("/api/progymnasmata/entries")
        if (!response.ok) {
          throw new Error("Failed to fetch entries")
        }
        const data = await response.json()

        // Sort by date (newest first)
        const sortedData = data.sort(
          (a: ProgymnasmataEntry, b: ProgymnasmataEntry) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )

        setEntries(sortedData)
        setFilteredEntries(sortedData)
      } catch (error) {
        console.error("Error fetching entries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEntries()
  }, [])

  useEffect(() => {
    let result = entries

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (entry) => entry.title.toLowerCase().includes(query) || entry.description.toLowerCase().includes(query),
      )
    }

    // Filter by type
    if (selectedType !== "All") {
      result = result.filter((entry) => entry.type === selectedType)
    }

    setFilteredEntries(result)
  }, [searchQuery, selectedType, entries])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
  }

  const handleViewContent = (entry: ProgymnasmataEntry) => {
    setSelectedEntry(entry)
    setShowContentViewer(true)
  }

  const handleCloseContentViewer = () => {
    setShowContentViewer(false)
    setSelectedEntry(null)
  }

  // Get unique types from entries
  const types = ["All", ...Array.from(new Set(entries.map((entry) => entry.type)))]

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col space-y-6 mb-8">
        <ProgymnasmataSearch onSearch={handleSearch} />
        <ProgymnasmataTypeFilter types={types} selectedType={selectedType} onTypeChange={handleTypeChange} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 h-64 animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-800 h-4 w-3/4 mb-2 rounded"></div>
              <div className="bg-gray-200 dark:bg-gray-800 h-4 w-1/2 mb-4 rounded"></div>
              <div className="bg-gray-200 dark:bg-gray-800 h-24 w-full mb-4 rounded"></div>
              <div className="bg-gray-200 dark:bg-gray-800 h-4 w-1/4 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEntries.map((entry) => (
            <ProgymnasmataCard
              key={`${entry.type}-${entry.slug}`}
              entry={entry}
              onViewContent={() => handleViewContent(entry)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No entries found matching your criteria.</p>
        </div>
      )}

      {showContentViewer && selectedEntry && (
        <ProgymnasmataContentViewer entry={selectedEntry} onClose={handleCloseContentViewer} />
      )}
    </div>
  )
}

