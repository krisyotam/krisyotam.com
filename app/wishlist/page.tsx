"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
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

export default function WishlistPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [filteredItems, setFilteredItems] = useState(wishlistData.products)

  const categories = ["All", ...Array.from(new Set(wishlistData.products.map((item) => item.category)))]

  // Effect to filter items whenever searchQuery or activeCategory changes
  useEffect(() => {
    console.log("Filtering items based on:", activeCategory); // Debug log
    const filtered = wishlistData.products.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = activeCategory === "All" || item.category === activeCategory

      return matchesSearch && matchesCategory
    })

    console.log("Filtered items:", filtered); // Debug log
    setFilteredItems(filtered) // Update the state with filtered items
  }, [searchQuery, activeCategory]) // Re-run effect when these change

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
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
                  setActiveCategory(category); // Update active category when button is clicked
                  console.log("Category clicked:", category); // Debug log
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

      {/* Modal for "About Wishlist" */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 left-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-background rounded-lg shadow-2xl border-0">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-semibold">About My Wishlist</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              This wishlist represents a curated collection of items that inspire and intrigue me. It's a reflection of
              my interests, aspirations, and the things I find beautiful or useful. By sharing this list, I hope to
              provide insights into my tastes and perhaps inspire others in their own pursuits.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
