"use client"

import { Search } from "lucide-react"

interface PlaylistSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function PlaylistSearch({ searchQuery, onSearchChange }: PlaylistSearchProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-gray-400 dark:text-[#999999]" />
      </div>
      <input
        type="text"
        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-[#1f1f1f] dark:bg-[#121212] dark:text-[#f2f2f2] dark:placeholder-[#999999] dark:focus:border-[#333333] dark:focus:ring-[#333333]"
        placeholder="Search playlists..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  )
}

