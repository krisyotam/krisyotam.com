"use client"

import { useState, useEffect } from "react"
import BentoCard from "./bento-card"
import { Item } from "./types"

interface BentoGridProps {
  items: Item[]
  filter?: string
  searchQuery?: string
}

export default function BentoGrid({ items, filter, searchQuery }: BentoGridProps) {
  const [filteredItems, setFilteredItems] = useState<Item[]>(items)

  useEffect(() => {
    let result = items;
    
    // Apply category filter
    if (filter && filter !== "All") {
      result = result.filter(item => item.category === filter);
    }
    
    // Apply search filter
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredItems(result);
  }, [items, filter, searchQuery]);

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">No items found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredItems.map((item) => (
        <div key={item.id} className="w-full">
          <BentoCard item={item} />
        </div>
      ))}
    </div>
  )
} 