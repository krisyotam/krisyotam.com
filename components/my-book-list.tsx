"use client"

import { useState, useMemo } from "react"
import { MyBookCard } from "./my-book-card"
import mybooksData from "../data/mybooks.json"
import { BookSearch } from "./book-search"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Book {
  slug: string
  title: string
  subtitle: string
  authors: string[]
  cover_photo?: string
  feature_image?: string
  access: "free" | "paid"
  link?: string
  classification: string
  category: string
  tags: string[]
  status?: string
}

export function MyBookList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [activeClassification, setActiveClassification] = useState<string>("All")

  // Filter out hidden books
  const activeBooks = useMemo(() => {
    return mybooksData.books
      .filter((book) => book.status === "active")
      .map((book) => ({
        ...book,
        access: book.access as "free" | "paid" // Ensure proper typing
      }));
  }, [])

  // Get all available classifications
  const classifications = useMemo(() => {
    const classificationSet = new Set(activeBooks.map((book) => book.classification))
    return Array.from(classificationSet).sort()
  }, [activeBooks])

  // Filter books by classification first
  const booksFilteredByClassification = useMemo(() => {
    return activeBooks.filter((book) => activeClassification === "All" || book.classification === activeClassification)
  }, [activeBooks, activeClassification])

  // Get categories available for the current classification filter
  const categories = useMemo(() => {
    const categorySet = new Set(booksFilteredByClassification.map((book) => book.category))
    return ["All", ...Array.from(categorySet)].sort((a, b) => (a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b)))
  }, [booksFilteredByClassification])

  // Final filtered books based on all criteria
  const filteredBooks = useMemo(() => {
    return activeBooks.filter((book) => {
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        book.authors.some((author) => author.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = activeCategory === "All" || book.category === activeCategory
      const matchesClassification = activeClassification === "All" || book.classification === activeClassification

      return matchesSearch && matchesCategory && matchesClassification
    })
  }, [activeBooks, searchQuery, activeCategory, activeClassification])

  // Handle classification change
  const handleClassificationChange = (value: string) => {
    setActiveClassification(value)
    // Reset category when changing classification
    setActiveCategory("All")
  }

  return (
    <div className="space-y-6">
      <BookSearch onSearch={setSearchQuery} />

      {/* Classification Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Classification</h3>
        <Tabs
          defaultValue="All"
          value={activeClassification}
          onValueChange={handleClassificationChange}
          className="w-full"
        >
          <TabsList className="w-full justify-start bg-muted/50">
            <TabsTrigger value="All">All</TabsTrigger>
            {classifications.map((classification) => (
              <TabsTrigger key={classification} value={classification}>
                {classification}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === activeCategory ? "default" : "secondary"}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredBooks.map((book) => (
          <MyBookCard key={book.slug} book={book} />
        ))}
        {filteredBooks.length === 0 && (
          <p className="text-center text-muted-foreground py-8 col-span-2">No books found matching your criteria.</p>
        )}
      </div>
    </div>
  )
}

