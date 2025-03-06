"use client"

import { useQuery, gql } from "@apollo/client"
import { BookCard } from "./book-card"
import booksData from "../data/books.json"
import { useState, useMemo } from "react"
import { BookSearch } from "./book-search"
import { Button } from "@/components/ui/button"

const GET_BOOK_BY_ISBN = gql`
  query GetBookByIsbn($isbn13: String!) {
    book(where: {isbn13: $isbn13}) {
      id
      slug
      title
      subtitle
      authors {
        name
      }
      cover
    }
  }
`

interface BookItemProps {
  isbn13: string
  title: string
  authors: string[]
}

function BookItem({ isbn13, title, authors }: BookItemProps) {
  const { data, loading, error } = useQuery(GET_BOOK_BY_ISBN, {
    variables: { isbn13 },
    fetchPolicy: "network-only",
  })

  if (loading) return <div className="animate-pulse bg-muted rounded-lg h-[140px]"></div>

  if (error || !data?.book) {
    console.error(`Error fetching book with ISBN ${isbn13}:`, error)
    return (
      <BookCard
        coverUrl="/placeholder.svg"
        title={title}
        author={authors.join(", ")}
        rating={0}
        isInteractive={false}
      />
    )
  }

  const book = data.book

  return (
    <BookCard
      coverUrl={book.cover || "/placeholder.svg"}
      title={book.title}
      subtitle={book.subtitle}
      author={book.authors.map((a: { name: string }) => a.name).join(", ") || authors.join(", ")}
      rating={0}
      isInteractive={false}
    />
  )
}

export function BookList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("All")

  const categories = useMemo(() => {
    const categorySet = new Set(booksData.books.map((book) => book.category))
    return ["All", ...Array.from(categorySet)].sort((a, b) => (a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b)))
  }, [])

  const filteredBooks = useMemo(() => {
    return booksData.books.filter((book) => {
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
              className={`transition-colors hover:bg-black hover:text-white ${
                category === activeCategory ? "bg-black text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredBooks.map((book) => (
          <BookItem key={book.isbn13} isbn13={book.isbn13} title={book.title} authors={book.authors} />
        ))}
        {filteredBooks.length === 0 && (
          <p className="text-center text-muted-foreground py-8 col-span-2">No books found matching your criteria.</p>
        )}
      </div>
    </div>
  )
}

