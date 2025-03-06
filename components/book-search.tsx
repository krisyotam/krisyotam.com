"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface BookSearchProps {
  onSearch: (query: string) => void
}

export function BookSearch({ onSearch }: BookSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search titles, categories, or tags..."
        className="pl-8"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}

