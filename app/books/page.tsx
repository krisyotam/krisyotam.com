"use client"

import { useState } from "react"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import { BookCard } from "../../components/book-card"
import { BookSearch } from "../../components/book-search"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import booksData from "../../data/books.json"

const client = new ApolloClient({
  uri: "https://literal.club/graphql/",
  cache: new InMemoryCache(),
})

export default function BooksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <ApolloProvider client={client}>
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <main>
            <BookList />
          </main>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 left-4 rounded-full"
              onClick={() => setIsModalOpen(true)}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-background">
            <DialogHeader>
              <DialogTitle>About the Books Page</DialogTitle>
              <DialogDescription>
                This page presents a curated list of recommended readings covering a variety of topics. These
                recommendations are based on personal experience and trusted opinions, offering a diverse selection of
                books to expand your knowledge and perspective.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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

