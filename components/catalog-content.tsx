"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LibraryBookCard } from "./library-book-card"
import { Book } from "@/types/library"
import { CustomSelect, SelectOption } from "@/components/ui/custom-select"

// Define content types
type ContentType = "all" | "literature" | "film"

// Define film interface
interface Film {
  id: string
  slug: string
  title: string
  director: string
  originalTitle?: string
  year: number
  country: string
  runtime: number
  genre: string[]
  posterUrl: string
  production: string
  collection: string
  language: string
  classification: string
  subClassification: string
}

// Combined item type
type CatalogItem = Book | (Film & { itemType: "film" })

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
  const [films, setFilms] = useState<Film[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedContentType, setSelectedContentType] = useState<ContentType>("all")
  const [selectedClassification, setSelectedClassification] = useState("all")
  const [selectedSubClassification, setSelectedSubClassification] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [availableClassifications, setAvailableClassifications] = useState<string[]>([])
  const [availableSubClassifications, setAvailableSubClassifications] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch books
        const booksResponse = await fetch("/api/library-catalog")
        const booksData = await booksResponse.json()

        // Fetch films
        const filmsResponse = await fetch("/api/films-catalog")
        const filmsData = await filmsResponse.json()

        if (Array.isArray(booksData)) {
          setBooks(booksData)
        } else {
          console.error("Unexpected books data format:", booksData)
          setBooks([])
        }

        if (Array.isArray(filmsData)) {
          setFilms(filmsData)
        } else {
          console.error("Unexpected films data format:", filmsData)
          setFilms([])
        }

        // Extract unique classifications and subclassifications from both books and films
        if (Array.isArray(booksData)) {
          const bookClassifications = [...new Set(booksData.map((book) => book.classification))].sort()
          const filmClassifications = Array.isArray(filmsData) ? [...new Set(filmsData.map((film) => film.classification))].sort() : []
          const allClassifications = [...new Set([...bookClassifications, ...filmClassifications])].sort()
          setAvailableClassifications(allClassifications)
          
          const bookSubClassifications = [...new Set(booksData.map((book) => book.subClassification))].sort()
          const filmSubClassifications = Array.isArray(filmsData) ? [...new Set(filmsData.map((film) => film.subClassification))].sort() : []
          const allSubClassifications = [...new Set([...bookSubClassifications, ...filmSubClassifications])].sort()
          setAvailableSubClassifications(allSubClassifications)
        }
      } catch (error) {
        console.error("Error fetching catalog data:", error)
        setError("Failed to load catalog")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Update available subclassifications based on selected classification (for both books and films)
  useEffect(() => {
    if (selectedClassification === "all") {
      const bookSubClassifications = [...new Set(books.map((book) => book.subClassification))].sort()
      const filmSubClassifications = [...new Set(films.map((film) => film.subClassification))].sort()
      const allSubClassifications = [...new Set([...bookSubClassifications, ...filmSubClassifications])].sort()
      setAvailableSubClassifications(allSubClassifications)
    } else {
      const bookSubClassifications = [...new Set(
        books
          .filter((book) => book.classification === selectedClassification)
          .map((book) => book.subClassification)
      )].sort()
      const filmSubClassifications = [...new Set(
        films
          .filter((film) => film.classification === selectedClassification)
          .map((film) => film.subClassification)
      )].sort()
      const filteredSubClassifications = [...new Set([...bookSubClassifications, ...filmSubClassifications])].sort()
      setAvailableSubClassifications(filteredSubClassifications)
    }
    setSelectedSubClassification("all")
  }, [selectedClassification, books, films])

  // Get filtered items based on content type and other filters
  const getFilteredItems = () => {
    let items: CatalogItem[] = []

    if (selectedContentType === "all" || selectedContentType === "literature") {
      items = [...items, ...books]
    }

    if (selectedContentType === "all" || selectedContentType === "film") {
      const filmsWithType = films.map(film => ({ ...film, itemType: "film" as const }))
      items = [...items, ...filmsWithType]
    }

    return items.filter((item) => {
      // Apply classification and subclassification filters to both books and films
      const matchesClassification = selectedClassification === "all" || item.classification === selectedClassification
      const matchesSubClassification = selectedSubClassification === "all" || item.subClassification === selectedSubClassification
      
      // Apply search filter
      let matchesSearch = false
      if (!searchQuery) {
        matchesSearch = true
      } else {
        // For books
        if ('authorName' in item || 'authorNames' in item) {
          const book = item as Book
          matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (book.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
            (book.authorNames?.some((name: string) => name.toLowerCase().includes(searchQuery.toLowerCase())) ?? false)
        }
        // For films
        else if ('director' in item) {
          const film = item as Film
          matchesSearch = film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            film.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (film.originalTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        }
      }

      return matchesClassification && matchesSubClassification && matchesSearch
    })
  }

  const filteredItems = getFilteredItems()

  // Content type options
  const contentTypeOptions: SelectOption[] = [
    { value: "all", label: "All" },
    { value: "literature", label: "Literature" },
    { value: "film", label: "Film" }
  ]

  // Convert classifications to SelectOption format
  const classificationOptions: SelectOption[] = [
    { value: "all", label: "All" },
    ...availableClassifications.map(code => ({
      value: code,
      label: `${code} - ${locClassifications[code] || code}`
    }))
  ]

  // Convert subclassifications to SelectOption format
  const subClassificationOptions: SelectOption[] = [
    { value: "all", label: "All" },
    ...availableSubClassifications.map(code => ({
      value: code,
      label: code
    }))
  ]

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

  if (books.length === 0 && films.length === 0) {
    return <div className="py-8 text-center">No items found in your catalog.</div>
  }

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="content-filter" className="text-xs text-muted-foreground">Content:</label>
            <CustomSelect
              value={selectedContentType}
              onValueChange={(value) => setSelectedContentType(value as ContentType)}
              options={contentTypeOptions}
              className="text-xs min-w-[100px]"
            />
          </div>
          
          {(selectedContentType === "all" || selectedContentType === "literature" || selectedContentType === "film") && (
            <>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <label htmlFor="classification-filter" className="text-xs text-muted-foreground">Class:</label>
                <CustomSelect
                  value={selectedClassification}
                  onValueChange={setSelectedClassification}
                  options={classificationOptions}
                  className="text-xs min-w-[140px]"
                />
              </div>
              
              <div className="flex items-center gap-2 whitespace-nowrap">
                <label htmlFor="subclassification-filter" className="text-xs text-muted-foreground">Subclass:</label>
                <CustomSelect
                  value={selectedSubClassification}
                  onValueChange={setSelectedSubClassification}
                  options={subClassificationOptions}
                  className="text-xs min-w-[100px]"
                />
              </div>
            </>
          )}
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder={selectedContentType === "film" ? "Search films..." : selectedContentType === "literature" ? "Search books..." : "Search catalog..."} 
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="py-8 text-center">No items found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map((item) => {
            if ('director' in item) {
              // This is a film
              const film = item as Film & { itemType: "film" }
              const filmSlug = film.title.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()
              
              return (
                <LibraryBookCard
                  key={film.id}
                  coverUrl={film.posterUrl}
                  title={film.title}
                  author={film.director}
                  rating={0}
                  subtitle={`${film.classification} - ${film.subClassification}`}
                  onClick={() => {
                    router.push(`/library/${film.classification}/${film.subClassification}/${filmSlug}`)
                  }}
                />
              )
            } else {
              // This is a book
              const book = item as Book
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
            }
          })}
        </div>
      )}
    </div>
  )
}
