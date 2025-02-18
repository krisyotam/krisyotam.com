"use client"

import { useState, useMemo } from "react"
import { MyBookCard } from "./my-book-card"
import mybooksData from "../data/mybooks.json"
import { BookSearch } from "./book-search"
import { Button } from "@/components/ui/button"

export function MyBookList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("All")

  const categories = useMemo(() => {
    const categorySet = new Set(mybooksData.books.map((book) => book.category))
    return ["All", ...Array.from(categorySet)].sort((a, b) => (a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b)))
  }, [])

  const filteredBooks = useMemo(() => {
    return mybooksData.books.filter((book) => {
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        book.authors.some((author) => author.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = activeCategory === "All" || book.category === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, activeCategory])

  return (
    <div className="space-y-6">
      <BookSearch onSearch={setSearchQuery} />
      {categories.length > 0 && (
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
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredBooks.map((book) => (
          <MyBookCard key={book.isbn13} book={book} />
        ))}
        {filteredBooks.length === 0 && (
          <p className="text-center text-muted-foreground py-8 col-span-2">No books found matching your criteria.</p>
        )}
      </div>
    </div>
  )
}

