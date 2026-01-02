"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LibraryBookCard } from "./library-book-card"
import { Book } from "@/types/content"

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
  const [selectedClassification, setSelectedClassification] = useState("all")
  const [selectedSubClassification, setSelectedSubClassification] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [availableClassifications, setAvailableClassifications] = useState<string[]>([])
  const [availableSubClassifications, setAvailableSubClassifications] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch("/api/library-catalog")
        const data = await response.json()

        if (Array.isArray(data)) {
          setBooks(data)

          // Extract unique classifications and subclassifications
          const classifications = [...new Set(data.map((book) => book.classification))].sort()
          setAvailableClassifications(classifications)
          
          const subClassifications = [...new Set(data.map((book) => book.subClassification))].sort()
          setAvailableSubClassifications(subClassifications)
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

  // Update available subclassifications based on selected classification
  useEffect(() => {
    if (selectedClassification === "all") {
      const allSubClassifications = [...new Set(books.map((book) => book.subClassification))].sort()
      setAvailableSubClassifications(allSubClassifications)
    } else {
      const filteredSubClassifications = [...new Set(
        books
          .filter((book) => book.classification === selectedClassification)
          .map((book) => book.subClassification)
      )].sort()
      setAvailableSubClassifications(filteredSubClassifications)
    }
    setSelectedSubClassification("all")
  }, [selectedClassification, books])

  const filteredBooks = books.filter((book) => {
    const matchesClassification = selectedClassification === "all" || book.classification === selectedClassification
    const matchesSubClassification = selectedSubClassification === "all" || book.subClassification === selectedSubClassification
    const matchesSearch = !searchQuery || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (book.authorNames?.some(name => name.toLowerCase().includes(searchQuery.toLowerCase())) ?? false)
    
    return matchesClassification && matchesSubClassification && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <svg className="animate-spin h-8 w-8 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    )
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>
  }

  if (books.length === 0) {
    return <div className="py-8 text-center">No books found in your catalog.</div>
  }

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="classification-filter" className="text-sm text-muted-foreground">Classification:</label>
            <select
              id="classification-filter"
              className="border rounded px-2 py-1 text-sm bg-background"
              value={selectedClassification}
              onChange={(e) => setSelectedClassification(e.target.value)}
            >
              <option value="all">All</option>
              {availableClassifications.map(code => (
                <option key={code} value={code}>{code} - {locClassifications[code] || code}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="subclassification-filter" className="text-sm text-muted-foreground">Subclassification:</label>
            <select
              id="subclassification-filter"
              className="border rounded px-2 py-1 text-sm bg-background"
              value={selectedSubClassification}
              onChange={(e) => setSelectedSubClassification(e.target.value)}
            >
              <option value="all">All</option>
              {availableSubClassifications.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search books..." 
            className="w-full px-3 py-2 border rounded text-sm bg-background"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="py-8 text-center">No books found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBooks.map((book) => {
            const bookSlug = book.title.toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim()
            
            return (
              <LibraryBookCard
                key={book.id}
                coverUrl={book.coverUrl || "/placeholder.svg?height=100&width=100"}
                title={book.title}
                author={book.authorName || book.authorNames?.join(", ") || "Unknown Author"}
                rating={0}
                subtitle={`${book.classification} - ${book.subClassification}`}
                onClick={() => {
                  router.push(`/library/${book.classification}/${book.subClassification}/${bookSlug}`)
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
