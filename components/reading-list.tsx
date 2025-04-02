"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  dateStarted: string
  dateFinished?: string
  status: "READING" | "FINISHED" | "WANT_TO_READ"
}

export function ReadingList() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBooks() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/books")

        if (!response.ok) {
          throw new Error("Failed to fetch books")
        }

        const data = await response.json()
        setBooks(data)
      } catch (err) {
        console.error("Error fetching books:", err)
        setError("Could not load books")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  // Filter books by status
  const readingBooks = books.filter((book) => book.status === "READING")
  const finishedBooks = books.filter((book) => book.status === "FINISHED")
  const toReadBooks = books.filter((book) => book.status === "WANT_TO_READ")

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex space-x-4">
            <div className="w-20 h-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-8">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="reading">Reading</TabsTrigger>
        <TabsTrigger value="have-read">Have Read</TabsTrigger>
        <TabsTrigger value="to-read">To Read</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-8">
        {books.map((book) => (
          <BookItem key={book.id} book={book} />
        ))}
      </TabsContent>

      <TabsContent value="reading" className="space-y-8">
        {readingBooks.length > 0 ? (
          readingBooks.map((book) => <BookItem key={book.id} book={book} />)
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No books currently being read.</p>
        )}
      </TabsContent>

      <TabsContent value="have-read" className="space-y-8">
        {finishedBooks.length > 0 ? (
          finishedBooks.map((book) => <BookItem key={book.id} book={book} />)
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No finished books.</p>
        )}
      </TabsContent>

      <TabsContent value="to-read" className="space-y-8">
        {toReadBooks.length > 0 ? (
          toReadBooks.map((book) => <BookItem key={book.id} book={book} />)
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No books in your to-read list.</p>
        )}
      </TabsContent>
    </Tabs>
  )
}

function BookItem({ book }: { book: Book }) {
  // Format date to match the design
  const formattedDate = book.dateFinished
    ? new Date(book.dateFinished).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : new Date(book.dateStarted).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })

  // Map status to display text
  const statusText = {
    READING: "Reading",
    FINISHED: "Have Read",
    WANT_TO_READ: "To Read",
  }[book.status]

  return (
    <div className="flex space-x-4">
      {book.coverImage && (
        <div className="relative w-20 h-28 overflow-hidden rounded border border-gray-200 dark:border-gray-700">
          <Image
            src={book.coverImage || "/placeholder.svg"}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <h3 className="font-medium text-lg">{book.title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{book.author}</p>
      </div>
      <div className="text-right">
        <p className="text-gray-600 dark:text-gray-400">{statusText}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{formattedDate}</p>
      </div>
    </div>
  )
}

