"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"

interface ProgymnasmataSearchProps {
  onSearch: (query: string) => void
}

export function ProgymnasmataSearch({ onSearch }: ProgymnasmataSearchProps) {
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
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-[#1A1A1A] placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-[#1A1A1A] focus:border-gray-500 dark:focus:border-gray-400 text-gray-900 dark:text-gray-100"
        placeholder="Search by title or description..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}

