"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

interface NotesSearchProps {
  onSearch: (query: string) => void
}

export function NotesSearch({ onSearch }: NotesSearchProps) {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearch(newQuery)
  }

  return (
    <div className="relative w-full mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-foreground/70" />
      </div>
      <input
        type="text"
        className="w-full p-2 pl-10 bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-foreground"
        placeholder="Search notes..."
        value={query}
        onChange={handleSearch}
      />
    </div>
  )
}

