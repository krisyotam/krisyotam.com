"use client"

import { useState, useMemo, useEffect } from "react"
import mybooksData from "../../data/mybooks.json"
import { MyBookCard } from "../../components/my-book-card"
import { BookSearch } from "../../components/book-search"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"
import { PageDescription } from "@/components/posts/typography/page-description"

// Add MyBooks page metadata after other imports
const mybooksPageData = {
  title: "My Books",
  subtitle: "Published Works and Writings",
  date: new Date().toISOString(),
  preview: "A collection of my published books, manuscripts, and ongoing writing projects across various genres.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 9,
}

type Book = {
  title: string
  subtitle: string
  category: string
  tags: string[]
  authors: string[]
  slug: string
  classification: string
  cover_photo?: string
  status: "active" | "hidden"
  access: "free" | "paid"
  link?: string
  feature_image?: string
}

export default function MyBooksPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        {/* Add the PageHeader component */}
        <PageHeader
          title={mybooksPageData.title}
          subtitle={mybooksPageData.subtitle}
          date={mybooksPageData.date}
          preview={mybooksPageData.preview}
          status={mybooksPageData.status}
          confidence={mybooksPageData.confidence}
          importance={mybooksPageData.importance}
        />

        <MyBookList initialBooks={mybooksData.books} />
      </div>
      
      {/* PageDescription component */}
      <PageDescription
        title="About My Books"
        description="I believe that education should be free and a universal right, aligning with the Russian school of thought on this matter. Specifically, this view resonates with the ideas of Anton Makarenko, a prominent Soviet educator who advocated for universal access to education as a means of social transformation and personal development. This page is an experiment in building in public. I don't fear someone stealing content from me because I believe that what is given freely cannot truly be taken. Knowledge shared is knowledge multiplied, not divided. By making these books available, I'm contributing to the democratization of knowledge and inviting collaboration and discussion. This approach not only aligns with my educational philosophy but also fosters a community of learners and thinkers."
      />
    </div>
  )
}

function MyBookList({ initialBooks }: { initialBooks: Book[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeClassification, setActiveClassification] = useState("All")

  // Filter out hidden books
  const activeBooks = useMemo(() => {
    return initialBooks.filter((book) => book.status === "active")
  }, [initialBooks])

  // Get all available classifications
  const classifications = useMemo(() => {
    return Array.from(new Set(activeBooks.map((book) => book.classification)))
  }, [activeBooks])

  // Filter books by classification first
  const booksFilteredByClassification = useMemo(() => {
    return activeBooks.filter((book) => activeClassification === "All" || book.classification === activeClassification)
  }, [activeBooks, activeClassification])

  // Get categories available for the current classification filter
  const availableCategories = useMemo(() => {
    return Array.from(new Set(booksFilteredByClassification.map((book) => book.category)))
  }, [booksFilteredByClassification])

  // Reset category when changing classification if the category doesn't exist in the new classification
  useEffect(() => {
    if (activeCategory !== "All" && !availableCategories.includes(activeCategory)) {
      setActiveCategory("All")
    }
  }, [availableCategories, activeCategory])

  // Final filtered books based on all criteria
  const filteredBooks = useMemo(() => {
    return activeBooks.filter((book) => {
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        book.authors.some((author: string) => author.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = activeCategory === "All" || book.category === activeCategory
      const matchesClassification = activeClassification === "All" || book.classification === activeClassification

      return matchesSearch && matchesCategory && matchesClassification
    })
  }, [activeBooks, searchQuery, activeCategory, activeClassification])

  // Handle classification change
  const handleClassificationChange = (value: string) => {
    setActiveClassification(value)
  }

  return (
    <div className="space-y-6">
      <BookSearch onSearch={setSearchQuery} />

      {/* Classification Filter - Visually distinct but matching aesthetic */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Classification</h3>
        <Tabs
          defaultValue="All"
          value={activeClassification}
          onValueChange={handleClassificationChange}
          className="w-full"
        >
          <TabsList className="w-full justify-start bg-muted/50">
            <TabsTrigger value="All">All</TabsTrigger>
            {classifications.map((classification) => (
              <TabsTrigger key={classification} value={classification}>
                {classification}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Category Filter - Dynamically filtered based on classification */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            key="All"
            variant={activeCategory === "All" ? "default" : "secondary"}
            onClick={() => setActiveCategory("All")}
          >
            All
          </Button>
          {availableCategories.map((category) => (
            <Button
              key={category}
              variant={category === activeCategory ? "default" : "secondary"}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredBooks.map((book) => (
          <MyBookCard key={book.slug} book={book} />
        ))}
        {filteredBooks.length === 0 && (
          <p className="text-center text-muted-foreground py-8 col-span-2">No books found matching your criteria.</p>
        )}
      </div>
    </div>
  )
}

