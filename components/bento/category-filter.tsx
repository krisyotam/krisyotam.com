"use client"

import { useRouter } from "next/navigation"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  basePath?: string
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  basePath = "/favs" 
}: CategoryFilterProps) {
  const router = useRouter()

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value
    onCategoryChange(newCategory)
    
    if (newCategory === "All") {
      router.push(basePath)
    } else {
      // Use natural slugs - lowercase the category
      router.push(`${basePath}/${newCategory.toLowerCase()}`)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="category-filter" className="text-sm text-muted-foreground">
        Filter by category:
      </label>
      <select
        id="category-filter"
        className="border border-input bg-background px-2 py-1 text-sm"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="All">All</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  )
} 