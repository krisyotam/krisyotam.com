"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"

interface NewsletterSearchProps {
  onSearch: (query: string) => void
}

export default function NewsletterSearch({ onSearch }: NewsletterSearchProps) {
  const [query, setQuery] = useState("")

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, onSearch])

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-400" />
      </div>
      <input
        type="search"
        className="w-full p-2 pl-10 text-sm border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700"
        placeholder="Search newsletters..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}

