"use client"

import { Grid, List } from "lucide-react"

interface NewsletterViewToggleProps {
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
}

export default function NewsletterViewToggle({ view, onViewChange }: NewsletterViewToggleProps) {
  return (
    <div className="flex items-center space-x-2 border border-gray-200 dark:border-zinc-700 rounded-md p-1">
      <button
        onClick={() => onViewChange("grid")}
        className={`p-1.5 rounded ${
          view === "grid"
            ? "bg-gray-100 dark:bg-zinc-800"
            : "text-gray-400 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-zinc-300"
        }`}
        aria-label="Grid view"
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`p-1.5 rounded ${
          view === "list"
            ? "bg-gray-100 dark:bg-zinc-800"
            : "text-gray-400 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-zinc-300"
        }`}
        aria-label="List view"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  )
}

