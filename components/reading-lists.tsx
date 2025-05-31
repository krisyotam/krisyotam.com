"use client"

import { useState, useEffect, useMemo } from "react"
import { useLazyQuery } from "@apollo/client"
import { GET_BOOK_BY_ISBN } from "@/lib/queries"
import { ReadingBookCard } from "@/components/reading-book-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { CustomSelect } from "@/components/ui/custom-select"

interface Author {
  name: string
}

interface BookData {
  id: string
  slug: string
  title: string
  subtitle?: string
  authors: Author[]
  cover?: string
}

interface LocalBook {
  title: string
  isbn13: string
}

interface ReadingList {
  id: string
  title: string
  description: string
  author: string
  books: LocalBook[]
}

interface ReadingListsData {
  lists: ReadingList[]
}

interface BookWithData extends LocalBook {
  data?: BookData
  loading?: boolean
  error?: boolean
}

export function ReadingLists() {
  const [listsData, setListsData] = useState<ReadingListsData | null>(null)
  const [selectedList, setSelectedList] = useState<string>("")
  const [booksWithData, setBooksWithData] = useState<Record<string, BookWithData>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [getBookByISBN] = useLazyQuery(GET_BOOK_BY_ISBN, {
    fetchPolicy: 'cache-first'
  })

  const BOOKS_PER_PAGE = 5
  // Load the local JSON data
  useEffect(() => {
    fetch('/api/reading/lists')
      .then(response => response.json())
      .then((data: ReadingListsData) => {
        setListsData(data)
        // Set the first list as default
        if (data.lists.length > 0) {
          setSelectedList(data.lists[0].id)
        }
      })
      .catch(error => {
        console.error('Error loading reading lists:', error)
      })
  }, [])

  // Reset page when list changes
  useEffect(() => {
    setCurrentPage(1)
    setBooksWithData({}) // Clear previous books data
  }, [selectedList])

  // Get the currently selected list data
  const currentList = useMemo(() => {
    return listsData?.lists.find(list => list.id === selectedList)
  }, [listsData, selectedList])

  // Calculate pagination
  const { paginatedBooks, totalPages } = useMemo(() => {
    if (!currentList) return { paginatedBooks: [], totalPages: 0 }
    
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE
    const endIndex = startIndex + BOOKS_PER_PAGE
    const paginatedBooks = currentList.books.slice(startIndex, endIndex)
    const totalPages = Math.ceil(currentList.books.length / BOOKS_PER_PAGE)
    
    return { paginatedBooks, totalPages }
  }, [currentList, currentPage, BOOKS_PER_PAGE])

  // Fetch book data for current page only
  useEffect(() => {
    if (!paginatedBooks.length) return

    // Initialize books for current page
    paginatedBooks.forEach(book => {
      if (!booksWithData[book.isbn13]) {
        setBooksWithData(prev => ({
          ...prev,
          [book.isbn13]: { ...book, loading: true }
        }))

        // Fetch book data one by one with a small delay to prevent overwhelming the API
        setTimeout(() => {
          getBookByISBN({ variables: { isbn13: book.isbn13 } })
            .then(({ data }) => {
              if (data?.book) {
                setBooksWithData(prev => ({
                  ...prev,
                  [book.isbn13]: {
                    ...prev[book.isbn13],
                    data: data.book,
                    loading: false,
                    error: false
                  }
                }))
              } else {
                setBooksWithData(prev => ({
                  ...prev,
                  [book.isbn13]: {
                    ...prev[book.isbn13],
                    loading: false,
                    error: true
                  }
                }))
              }
            })
            .catch(error => {
              console.error(`Error fetching book ${book.isbn13}:`, error)
              setBooksWithData(prev => ({
                ...prev,
                [book.isbn13]: {
                  ...prev[book.isbn13],
                  loading: false,
                  error: true
                }
              }))
            })
        }, Math.random() * 100) // Small random delay to stagger requests
      }
    })
  }, [paginatedBooks, getBookByISBN, booksWithData])
  // Get books to display (only current page)
  const booksToDisplay = paginatedBooks.map(book => booksWithData[book.isbn13]).filter(Boolean)

  if (!listsData) {
    return <p className="text-muted-foreground">Loading lists...</p>
  }

  return (
    <div className="space-y-6">
      {/* List selector dropdown */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="list-filter" className="text-sm text-muted-foreground">List:</label>
          <CustomSelect
            value={selectedList}
            onValueChange={setSelectedList}
            options={listsData.lists.map(list => ({
              value: list.id,
              label: list.title
            }))}
            placeholder="Select a list"
            className="min-w-[200px]"
          />
        </div>
      </div>

      {/* Current list info */}
      {currentList && (
        <div className="space-y-2 pb-4 border-b border-border">
          <h3 className="text-lg font-semibold">{currentList.title}</h3>
          <p className="text-sm text-muted-foreground">{currentList.description}</p>
          <p className="text-xs text-muted-foreground">Curated by {currentList.author}</p>
          <p className="text-xs text-muted-foreground">
            {currentList.books.length} books • Page {currentPage} of {totalPages}
          </p>
        </div>
      )}

      {/* Books display using ReadingBookCard */}
      <div className="space-y-6">
        {booksToDisplay.length > 0 ? (
          booksToDisplay.map((bookWithData) => {
            if (!bookWithData) return null
            
            const bookData = bookWithData.data
            const isLoading = bookWithData.loading
            const hasError = bookWithData.error && !isLoading
            
            // Use fallback data for title if API fails
            const displayTitle = bookData?.title || bookWithData.title
            const displaySubtitle = bookData?.subtitle || ""
            const displayAuthor = bookData?.authors?.map(a => a.name).join(", ") || "Unknown Author"
            
            // Use placeholder if no cover available instead of loading animation
            const displayCover = (isLoading || hasError) 
              ? "/placeholder.svg?height=100&width=100"
              : bookData?.cover || "/placeholder.svg?height=100&width=100"
            
            return (
              <ReadingBookCard
                key={bookWithData.isbn13}
                coverUrl={displayCover}
                title={displayTitle}
                subtitle={displaySubtitle}
                author={displayAuthor}
                rating={0}
                onClick={() => {
                  if (bookData?.slug) {
                    window.open(`https://literal.club/book/${bookData.slug}`, "_blank")
                  }
                }}
              />
            )
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No books in this list yet.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
