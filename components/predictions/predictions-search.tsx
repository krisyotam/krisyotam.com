"use client"
import { Search } from "lucide-react"

interface PredictionsSearchProps {
  onSearch: (term: string) => void
}

export function PredictionsSearch({ onSearch }: PredictionsSearchProps) {
  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
        <input
          type="text"
          placeholder="Search predictions..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-neutral-500 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-400 dark:focus:border-neutral-700 dark:focus:ring-neutral-800"
          aria-label="Search predictions"
        />
      </div>
    </div>
  )
}

