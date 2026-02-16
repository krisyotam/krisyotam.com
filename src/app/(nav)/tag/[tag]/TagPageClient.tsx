"use client"

import { useState, useMemo } from "react"
import { Directory } from "@/components/core"
import { Navigation, ContentTable } from "@/components/content"
import type { DirectoryItem } from "@/components/core"

interface TagPageClientProps {
  items: DirectoryItem[]
}

export default function TagPageClient({ items }: TagPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list" | "directory">("directory")

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items
    const q = searchQuery.toLowerCase()
    return items.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q) ||
      (item.preview && item.preview.toLowerCase().includes(q)) ||
      (item.type && item.type.toLowerCase().includes(q))
    )
  }, [items, searchQuery])

  return (
    <>
      <Navigation
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search posts..."
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
        showGridOption={false}
        showDirectoryOption={true}
      />

      {viewMode === "directory" ? (
        <Directory
          items={items}
          showType={true}
          searchQuery={searchQuery}
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
