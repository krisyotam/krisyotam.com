"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  dateStarted: string
  dateFinished?: string
  status: "READING" | "FINISHED" | "WANT_TO_READ"
}

export function HomeBook() {
  const [currentBook, setCurrentBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCurrentBook() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/books/current")

        if (!response.ok) {
          throw new Error("Failed to fetch current book")
        }

        const data = await response.json()
        setCurrentBook(data)
      } catch (err) {
        console.error("Error fetching current book:", err)
        setError("Could not load current book")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentBook()
  }, [])

  if (isLoading) {
    return (
      <Card className="p-4 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="flex space-x-4">
          <div className="w-20 h-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (error || !currentBook) {
    return (
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Reading</h2>
          <ArrowUpRight className="h-5 w-5 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error || "No books currently being read"}</p>
      </Card>
    )
  }

  // Format date to match the design
  const formattedDate = new Date(currentBook.dateStarted).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })

  return (
    <Link href="/reading" className="block">
      <Card className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Reading</h2>
          <ArrowUpRight className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex space-x-4">
          {currentBook.coverImage && (
            <div className="relative w-20 h-28 overflow-hidden rounded border border-gray-200 dark:border-gray-700">
              <Image
                src={currentBook.coverImage || "/placeholder.svg"}
                alt={`Cover of ${currentBook.title}`}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-medium text-lg">{currentBook.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{currentBook.author}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{formattedDate}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

