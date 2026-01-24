"use client"

import { useState, useEffect } from "react"
import { ReadingNavigation } from "@/components/reading-navigation"
import { ReadingBookCard } from "@/components/reading-book-card"

interface Book {
  title: string
  subtitle: string
  author: string
  cover: string
  link: string
}

function CurrentlyReadingContent() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetch('/api/media?source=reading&type=want-to-read')
        const data = await response.json()
        setBooks(data.wantToRead || [])
      } catch (error) {
        console.error('Error loading currently reading books:', error)
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [])

  if (loading) return null

  if (books.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Not currently reading anything.</p>
      </div>
    )
  }

  const handleBookClick = (book: Book) => {
    if (book.link) {
      window.open(book.link, '_blank')
    }
  }

  return (
    <div className="mt-8">
      <div className="space-y-6">
        {books.map((book, index) => (
          <ReadingBookCard
            key={index}
            coverUrl={book.cover}
            title={book.title}
            subtitle={book.subtitle || ""}
            author={book.author}
            rating={0}
            onClick={() => handleBookClick(book)}
          />
        ))}
      </div>
    </div>
  )
}

export default function WantToReadClientPage() {
  return (
    <div>
      <ReadingNavigation />
      <CurrentlyReadingContent />
    </div>
  )
}
