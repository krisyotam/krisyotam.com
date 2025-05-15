"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = "Search by title, author, tags..." }: SearchBarProps) {
  const [query, setQuery] = useState("")

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, onSearch])

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-input bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
} 