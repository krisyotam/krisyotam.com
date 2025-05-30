"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import wishlistData from "@/data/wishlist.json"
import Wishlist from "@/components/wishlist"
import { PageHeader } from "@/components/page-header"
import { PageDescription } from "@/components/posts/typography/page-description"

// Wishlist page metadata
const wishlistPageData = {
  title: "Wishlist",
  subtitle: "Items I'd Like to Have",
  date: new Date().toISOString(),
  preview: "A curated collection of items that inspire and intrigue me, reflecting my interests and aspirations.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 4,
}

export default function WishlistPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [filteredItems, setFilteredItems] = useState(wishlistData.products)

  const categories = ["All", ...Array.from(new Set(wishlistData.products.map((item) => item.category)))]

  // Effect to filter items whenever searchQuery or activeCategory changes
  useEffect(() => {
    console.log("Filtering items based on:", activeCategory) // Debug log
    const filtered = wishlistData.products.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = activeCategory === "All" || item.category === activeCategory

      return matchesSearch && matchesCategory
    })

    console.log("Filtered items:", filtered) // Debug log
    setFilteredItems(filtered) // Update the state with filtered items
  }, [searchQuery, activeCategory]) // Re-run effect when these change

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        {/* Add the PageHeader component */}
        <PageHeader
          title={wishlistPageData.title}
          subtitle={wishlistPageData.subtitle}
          date={wishlistPageData.date}
          preview={wishlistPageData.preview}
          status={wishlistPageData.status}
          confidence={wishlistPageData.confidence}
          importance={wishlistPageData.importance}
        />

        <div className="mb-6 space-y-4">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search Wishlist..."
            className="px-4 py-2 border rounded-lg w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Category filter buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === activeCategory ? "default" : "secondary"}
                onClick={() => {
                  setActiveCategory(category) // Update active category when button is clicked
                  console.log("Category clicked:", category) // Debug log
                }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Render filtered items */}
        <Wishlist items={filteredItems} />
      </div>

      {/* Page Description Component */}
      <PageDescription
        title="About My Wishlist"
        description="This wishlist represents a curated collection of items that inspire and intrigue me. It's a reflection of my interests, aspirations, and the things I find beautiful or useful. By sharing this list, I hope to provide insights into my tastes and perhaps inspire others in their own pursuits."
      />
    </div>
  )
}

