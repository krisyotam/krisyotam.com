/* =============================================================================
 * LIBRARY COMPONENTS
 * Unified component file for all library-related UI
 *
 * Sections:
 *   1. IMPORTS
 *   2. TYPES & INTERFACES
 *   3. CONFIGURATION
 *   4. UI COMPONENTS
 *      - LibraryBookCard (book/film display card)
 *   5. CONTENT SECTIONS
 *      - CatalogContent (filterable catalog view)
 *      - LibraryNotesContent (library notes)
 *   6. PAGE CONTENT
 *      - LibraryTabs (main page router)
 *   7. EXPORTS
 * ============================================================================= */

"use client"

/* =============================================================================
 * 1. IMPORTS
 * ============================================================================= */

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { CustomSelect, type SelectOption } from "@/components/ui/custom-select"
import { Book } from "@/types/content"
import { formatDate } from "@/lib/date"

/* =============================================================================
 * 2. TYPES & INTERFACES
 * ============================================================================= */

type ContentType = "all" | "literature" | "film"

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

type CatalogItem = Book | (Film & { itemType: "film" })

type Note = {
  id: string
  date: string
  title: string
  content: string
}

/* =============================================================================
 * 3. CONFIGURATION
 * ============================================================================= */

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

/* =============================================================================
 * 4. UI COMPONENTS
 * ============================================================================= */

interface LibraryBookCardProps {
  coverUrl: string
  title: string
  subtitle?: string
  author: string
  rating: number
  onClick?: () => void
}

function LibraryBookCard({ coverUrl, title, subtitle, author, rating, onClick }: LibraryBookCardProps) {
  return (
    <Card
      className="flex overflow-hidden transition-colors hover:bg-accent/50 group h-[140px] cursor-pointer"
      onClick={onClick}
    >
      <div className="w-[100px] bg-muted p-4">
        <div className="relative h-[100px] w-full">
          <Image src={coverUrl || "/placeholder.svg"} alt={title} fill className="object-cover" unoptimized={coverUrl?.includes('krisyotam.com')} />
        </div>
      </div>
      <div className="flex-1 p-4 overflow-hidden">
        <div className="space-y-1.5">
          <h3 className="font-medium leading-tight line-clamp-2">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground line-clamp-1">{subtitle}</p>}
          <p className="text-sm text-muted-foreground truncate">by {author}</p>
        </div>
        {rating > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm text-muted-foreground">{rating}/5</span>
          </div>
        )}
      </div>
    </Card>
  )
}

/* =============================================================================
 * 5. CONTENT SECTIONS
 * ============================================================================= */

function CatalogContent() {
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
        const booksResponse = await fetch("/api/media?source=library&type=catalog")
        const booksData = await booksResponse.json()

        const filmsResponse = await fetch("/api/film?resource=catalog")
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
      const matchesClassification = selectedClassification === "all" || item.classification === selectedClassification
      const matchesSubClassification = selectedSubClassification === "all" || item.subClassification === selectedSubClassification

      let matchesSearch = false
      if (!searchQuery) {
        matchesSearch = true
      } else {
        if ('authorName' in item || 'authorNames' in item) {
          const book = item as Book
          matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (book.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
            (book.authorNames?.some((name: string) => name.toLowerCase().includes(searchQuery.toLowerCase())) ?? false)
        } else if ('director' in item) {
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

  const contentTypeOptions: SelectOption[] = [
    { value: "all", label: "All" },
    { value: "literature", label: "Literature" },
    { value: "film", label: "Film" }
  ]

  const classificationOptions: SelectOption[] = [
    { value: "all", label: "All" },
    ...availableClassifications.map(code => ({
      value: code,
      label: `${code} - ${locClassifications[code] || code}`
    }))
  ]

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

function LibraryNotesContent() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await fetch("/api/library-notes")
        const data = await response.json()

        let parsedNotes: Note[] = []

        if (data && Array.isArray(data.notes)) {
          parsedNotes = data.notes
        } else if (Array.isArray(data)) {
          parsedNotes = data
        } else {
          console.error("Unexpected data format:", data)
          setError("Received invalid data format from API")
          return
        }

        const sortedNotes = parsedNotes.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        setNotes(sortedNotes)
      } catch (error) {
        console.error("Error fetching notes:", error)
        setError("Failed to load notes")
        setNotes([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [])

  if (loading) {
    return <div className="py-8 text-center">Loading notes...</div>
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>
  }

  if (notes.length === 0) {
    return <div className="py-8 text-center">No notes found.</div>
  }

  return (
    <div className="grid grid-cols-1 gap-4 py-4">
      {notes.map((note) => (
        <Card key={note.id} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{note.title}</h3>
            <span className="text-xs text-muted-foreground">
              {formatDate(note.date.toString())}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{note.content}</p>
        </Card>
      ))}
    </div>
  )
}

/* =============================================================================
 * 6. PAGE CONTENT
 * ============================================================================= */

export function LibraryTabs() {
  const [activeTab, setActiveTab] = useState("catalog")

  const tabs = [
    { id: "catalog", label: "Catalog" },
    { id: "notes", label: "Notes" }
  ]

  return (
    <div>
      <div className="relative">
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium relative transition-colors ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "catalog" && <CatalogContent />}
        {activeTab === "notes" && <LibraryNotesContent />}
      </div>
    </div>
  )
}
