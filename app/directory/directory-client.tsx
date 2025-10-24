"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { DirectoryPageHeader } from "@/components/directory-page-header"
import { DirectoryCategoryHeader } from "@/components/directory-category-header"
import "./directory.css"

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain"

interface DirectoryItem {
  title: string
  subtitle: string
  date: string
  preview: string
  status: Status
  confidence: Confidence
  importance: number
  path: string
  type: "page" | "category"
  slug?: string
}

export default function DirectoryClient() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [items, setItems] = useState<DirectoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/directory")
        const data = await response.json()
        setItems(data.all || [])
      } catch (error) {
        console.error("Error fetching directory data:", error)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredItems = items.filter((item) => {
    // Filter by search term
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.preview.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by type
    const matchesFilter =
      filter === "all" ||
      (filter === "pages" && item.type === "page") ||
      (filter === "categories" && item.type === "category")

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return <div className="text-center py-10">Loading directory...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search pages and categories..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <span className="filter-label">Filter:</span>
          <div className="filter-buttons">
            <button className={`filter-button ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
              All Items
            </button>
            <button
              className={`filter-button ${filter === "pages" ? "active" : ""}`}
              onClick={() => setFilter("pages")}
            >
              Pages Only
            </button>
            <button
              className={`filter-button ${filter === "categories" ? "active" : ""}`}
              onClick={() => setFilter("categories")}
            >
              Article Indexes Only
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div key={index}>
              {item.type === "page" ? (
                <DirectoryPageHeader
                  title={item.title}
                  subtitle={item.subtitle}
                  date={item.date}
                  preview={item.preview}
                  status={item.status as Status}
                  confidence={item.confidence as Confidence}
                  importance={item.importance}
                  path={item.path}
                />
              ) : (
                <DirectoryCategoryHeader
                  title={item.title}
                  subtitle={item.subtitle}
                  date={item.date}
                  preview={item.preview}
                  status={item.status as Status}
                  confidence={item.confidence as Confidence}
                  importance={item.importance}
                  path={item.path}
                  slug={item.slug || ""}
                />
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-10 text-neutral-500 dark:text-neutral-400">
            No items found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  )
}
