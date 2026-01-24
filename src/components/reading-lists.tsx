"use client"

import { useState, useEffect, useMemo } from "react"
import { ReadingBookCard } from "@/components/reading-book-card"
import { CustomSelect } from "@/components/ui/custom-select"

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

export function ReadingLists() {
  const [listsData, setListsData] = useState<ReadingListsData | null>(null)
  const [selectedList, setSelectedList] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)

  const BOOKS_PER_PAGE = 5

  // Load the local JSON data
  useEffect(() => {
    fetch('/api/media?source=reading&type=lists')
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
        {paginatedBooks.length > 0 ? (
          paginatedBooks.map((book) => (
            <ReadingBookCard
              key={book.isbn13}
              coverUrl="/placeholder.svg?height=100&width=100"
              title={book.title}
              subtitle=""
              author="Unknown Author"
              rating={0}
            />
          ))
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
