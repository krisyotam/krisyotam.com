"use client"

import { useState } from "react"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import { BookCard } from "../../components/book-card"
import { BookSearch } from "../../components/book-search"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { PageDescription } from "@/components/posts/typography/page-description"
import booksData from "../../data/books.json"

// Add Books page metadata after other imports
const booksPageData = {
  title: "Recommended Books",
  subtitle: "Reading Suggestions and Reviews",
  date: new Date().toISOString(),
  preview: "A curated collection of recommended books spanning various genres, topics, and fields of interest.",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 7,
}

const client = new ApolloClient({
  uri: "https://literal.club/graphql/",
  cache: new InMemoryCache(),
})

export default function BooksPage() {
  return (
    <ApolloProvider client={client}>
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          {/* Add the PageHeader component */}
          <PageHeader
            title={booksPageData.title}
            subtitle={booksPageData.subtitle}
            date={booksPageData.date}
            preview={booksPageData.preview}
            status={booksPageData.status}
            confidence={booksPageData.confidence}
            importance={booksPageData.importance}
          />

          <main>
            <BookList />
          </main>
        </div>
        <PageDescription
          title="About the Books Page"
          description="This page presents a curated list of recommended readings covering a variety of topics. These recommendations are based on personal experience and trusted opinions, offering a diverse selection of books to expand your knowledge and perspective."
        />
      </div>
    </ApolloProvider>
  )
}

function BookList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("All")

  const categories = Array.from(new Set(booksData.books.map((book) => book.category)))

  const filteredBooks = booksData.books.filter((book) => {
    const matchesSearch =
      searchQuery === "" ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      book.authors.some((author) => author.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === "All" || book.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <BookSearch onSearch={setSearchQuery} />
      <div className="flex flex-wrap gap-2">
        <Button
          key="All"
          variant={activeCategory === "All" ? "default" : "secondary"}
          onClick={() => setActiveCategory("All")}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === activeCategory ? "default" : "secondary"}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.isbn13}
            isbn={book.isbn13}
            title={book.title}
            authors={book.authors}
            rating={0}
            isInteractive={false}
          />
        ))}
        {filteredBooks.length === 0 && (
          <p className="text-center text-muted-foreground py-8 col-span-2">No books found matching your criteria.</p>
        )}
      </div>
    </div>
  )
}

