"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import { PageHeader } from "@/components/page-header"
import BentoGrid from "@/components/bento/bento-grid"
import { SearchBar } from "@/components/bento/search-bar"
import { CategoryFilter } from "@/components/bento/category-filter"
import favsData from "@/data/favs.json"
import { Item } from "@/components/bento/types"

interface FavsClientProps {
  initialCategory?: string
}

export default function FavsClient({ initialCategory = "All" }: FavsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  
  const items = favsData.items as Item[]
  
  // Get unique categories from the items
  const categories = Array.from(new Set(items.map(item => item.category))).sort()
  
  useEffect(() => {
    // Update the selected category when initialCategory changes
    setSelectedCategory(initialCategory)
  }, [initialCategory])
  
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <PageHeader
          title="Favs"
          date={new Date().toISOString()}
          preview="A collection of my favorite things across art, poetry, quotes, and more"
          status="Finished"
          confidence="highly likely"
          importance={8}
        />
        
        <div className="mt-8 space-y-4">
          <SearchBar onSearch={handleSearch} />
          
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onCategoryChange={handleCategoryChange} 
            basePath="/favs"
          />
          
          <BentoGrid 
            items={items} 
            filter={selectedCategory} 
            searchQuery={searchQuery} 
          />
        </div>
      </main>
    </div>
  )
} 