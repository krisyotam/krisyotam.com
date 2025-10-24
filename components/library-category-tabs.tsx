"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LibraryCategoryTabsProps {
  categories: { code: string; name: string }[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

// Map of Library of Congress classifications to human-readable names
const locClassifications: Record<string, string> = {
  A: "General Works",
  B: "Philosophy, Psychology, Religion",
  C: "Auxiliary Sciences of History",
  D: "World History",
  E: "History of the Americas (US)",
  F: "History of the Americas (Other)",
  G: "Geography, Anthropology, Recreation",
  H: "Social Sciences",
  J: "Political Science",
  K: "Law",
  L: "Education",
  M: "Music",
  N: "Fine Arts",
  P: "Language and Literature",
  Q: "Science",
  R: "Medicine",
  S: "Agriculture",
  T: "Technology",
  U: "Military Science",
  V: "Naval Science",
  Z: "Bibliography, Library Science",
}

export function LibraryCategoryTabs({ categories, activeCategory, onCategoryChange }: LibraryCategoryTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftScroll, setShowLeftScroll] = useState(false)
  const [showRightScroll, setShowRightScroll] = useState(false)

  // Check if scrolling is needed
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        setShowLeftScroll(scrollLeft > 0)
        setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
      }
    }

    checkScroll()
    window.addEventListener("resize", checkScroll)

    // Add scroll event listener to the container
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll)
    }

    return () => {
      window.removeEventListener("resize", checkScroll)
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", checkScroll)
      }
    }
  }, [categories])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <div className="relative w-full mb-4">
      {showLeftScroll && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background shadow-md"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide py-2 px-8 space-x-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          className="whitespace-nowrap"
          onClick={() => onCategoryChange("all")}
        >
          All Books
        </Button>

        {categories.map((category) => (
          <Button
            key={category.code}
            variant={activeCategory === category.code ? "default" : "outline"}
            className="whitespace-nowrap"
            onClick={() => onCategoryChange(category.code)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {showRightScroll && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background shadow-md"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

