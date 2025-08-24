"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface DocsFilterProps {
  categories: string[]
  aiModels: string[]
  activeCategory: string
  activeModel: string
  searchQuery: string
  onCategoryChange: (category: string) => void
  onModelChange: (model: string) => void
  onSearchChange: (search: string) => void
}

export function DocsFilter({
  categories,
  aiModels,
  activeCategory,
  activeModel,
  searchQuery,
  onCategoryChange,
  onModelChange,
  onSearchChange,
}: DocsFilterProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(localSearch)
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="relative">
        <form onSubmit={handleSearchSubmit}>
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </form>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange("All")}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">AI Models</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeModel === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => onModelChange("All")}
            >
              All
            </Button>
            {aiModels.map((model) => (
              <Button
                key={model}
                variant={activeModel === model ? "default" : "outline"}
                size="sm"
                onClick={() => onModelChange(model)}
              >
                {model}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 