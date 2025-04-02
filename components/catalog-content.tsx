"use client"

import { useEffect, useState } from "react"
import { LibraryBookCard } from "./library-book-card"
import { LibraryCategoryTabs } from "./library-category-tabs"

type Book = {
  id: string
  title: string
  author: string
  coverUrl: string
  classification: string
  subClassification: string
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

export function CatalogContent() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [availableCategories, setAvailableCategories] = useState<{ code: string; name: string }[]>([])

  useEffect(() => {
    async function fetchBooks() {
      try {
        // Use the dedicated library-catalog API route
        const response = await fetch("/api/library-catalog")
        const data = await response.json()

        if (Array.isArray(data)) {
          setBooks(data)

          // Extract unique classifications from books
          const uniqueClassifications = [...new Set(data.map((book) => book.classification))]

          // Create category objects with code and name
          const categories = uniqueClassifications
            .filter((code) => locClassifications[code]) // Only include known classifications
            .map((code) => ({
              code,
              name: locClassifications[code],
            }))
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by name

          setAvailableCategories(categories)
        } else {
          console.error("Unexpected data format:", data)
          setError("Received invalid data format from API")
          setBooks([])
        }
      } catch (error) {
        console.error("Error fetching library catalog:", error)
        setError("Failed to load library catalog")
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const filteredBooks =
    activeCategory === "all" ? books : books.filter((book) => book.classification === activeCategory)

  if (loading) {
    return <div className="py-8 text-center">Loading catalog...</div>
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>
  }

  if (books.length === 0) {
    return <div className="py-8 text-center">No books found in your catalog.</div>
  }

  return (
    <div>
      <LibraryCategoryTabs
        categories={availableCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {filteredBooks.length === 0 ? (
        <div className="py-8 text-center">No books found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 py-4">
          {filteredBooks.map((book) => (
            <LibraryBookCard
              key={book.id}
              coverUrl={book.coverUrl || "/placeholder.svg?height=100&width=100"}
              title={book.title}
              author={book.author}
              rating={0}
              subtitle={`${book.classification} - ${book.subClassification}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

