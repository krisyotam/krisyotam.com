"use client"

import { useState, useMemo } from "react"
import { Directory } from "@/components/core"
import { Navigation, ContentTable } from "@/components/content"
import type { DirectoryItem } from "@/components/core"
import type { SelectOption } from "@/components/ui/custom-select"

interface TagPageClientProps {
  items: DirectoryItem[]
}

const TYPE_FILTER_OPTIONS: SelectOption[] = [
  { value: "all", label: "All" },
  { value: "content", label: "Content" },
  { value: "documents", label: "Documents" },
]

function sortItems(items: DirectoryItem[], typeFilter: string): DirectoryItem[] {
  const sorted = [...items]
  if (typeFilter === "all") {
    // Content first, documents second; chronological within each group
    sorted.sort((a, b) => {
      const aIsDoc = a.type === "documents" ? 1 : 0
      const bIsDoc = b.type === "documents" ? 1 : 0
      if (aIsDoc !== bIsDoc) return aIsDoc - bIsDoc
      const dateA = a.end_date || a.start_date || ""
      const dateB = b.end_date || b.start_date || ""
      return dateB.localeCompare(dateA)
    })
  } else {
    sorted.sort((a, b) => {
      const dateA = a.end_date || a.start_date || ""
      const dateB = b.end_date || b.start_date || ""
      return dateB.localeCompare(dateA)
    })
  }
  return sorted
}

export default function TagPageClient({ items }: TagPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list" | "directory">("directory")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredItems = useMemo(() => {
    let result = items
    // Type filter
    if (typeFilter === "content") {
      result = result.filter((item) => item.type !== "documents")
    } else if (typeFilter === "documents") {
      result = result.filter((item) => item.type === "documents")
    }
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((item) =>
        item.title.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q) ||
        (item.preview && item.preview.toLowerCase().includes(q)) ||
        (item.type && item.type.toLowerCase().includes(q))
      )
    }
    return sortItems(result, typeFilter)
  }, [items, searchQuery, typeFilter])

  return (
    <>
      <Navigation
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search posts..."
        showCategoryFilter={true}
        categoryOptions={TYPE_FILTER_OPTIONS}
        selectedCategory={typeFilter}
        onCategoryChange={setTypeFilter}
        categoryPlaceholder="All"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
        showGridOption={false}
        showDirectoryOption={true}
      />

      {viewMode === "directory" ? (
        <Directory
          items={filteredItems}
          showType={true}
          searchQuery=""
        />
      ) : (
        <ContentTable
          items={filteredItems}
          showType={true}
          emptyMessage="No posts found."
        />
      )}
    </>
  )
}
