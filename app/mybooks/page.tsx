"use client"

import { useState, useEffect, useMemo } from "react"
import { getFeaturedImage } from "../../utils/ghost"
import mybooksData from "../../data/mybooks.json"
import { MyBookCard } from "../../components/my-book-card"
import { BookSearch } from "../../components/book-search"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"

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

const revalidate = 1800 // 30 minutes

type Book = {
  subtitle: string
  title: string
  category: string
  tags: string[]
  authors: string[]
  slug: string
  feature_image?: string
  classification: string
}

export default function MyBooksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // In the return statement, add the PageHeader component before the MyBookList component
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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 left-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-background rounded-lg shadow-2xl border-0">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-semibold">About My Books</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              I believe that education should be free and a universal right, aligning with the Russian school of thought
              on this matter. Specifically, this view resonates with the ideas of Anton Makarenko, a prominent Soviet
              educator who advocated for universal access to education as a means of social transformation and personal
              development. This page is an experiment in building in public. I don't fear someone stealing content from
              me because I believe that what is given freely cannot truly be taken. Knowledge shared is knowledge
              multiplied, not divided. By making these books available, I'm contributing to the democratization of
              knowledge and inviting collaboration and discussion. This approach not only aligns with my educational
              philosophy but also fosters a community of learners and thinkers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MyBookList({ initialBooks }: { initialBooks: Book[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeClassification, setActiveClassification] = useState("All")
  const [booksWithImages, setBooksWithImages] = useState(initialBooks)

  useEffect(() => {
    const fetchFeaturedImages = async () => {
      try {
        const updatedBooks = await Promise.all(
          initialBooks.map(async (book: any) => {
            try {
              const featuredImage = await getFeaturedImage(book.slug)
              return { ...book, feature_image: featuredImage || "/placeholder.svg" }
            } catch (error) {
              console.error(`Error fetching image for ${book.title}:`, error)
              return { ...book, feature_image: "/placeholder.svg" }
            }
          }),
        )
        setBooksWithImages(updatedBooks)
      } catch (error) {
        console.error("Error fetching featured images:", error)
      }
    }

    fetchFeaturedImages()
  }, [initialBooks])

  // Get all available classifications
  const classifications = useMemo(() => {
    return Array.from(new Set(initialBooks.map((book) => book.classification)))
  }, [initialBooks])

  // Filter books by classification first
  const booksFilteredByClassification = useMemo(() => {
    return booksWithImages.filter(
      (book) => activeClassification === "All" || book.classification === activeClassification,
    )
  }, [booksWithImages, activeClassification])

  // Get categories available for the current classification filter
  const availableCategories = useMemo(() => {
    return Array.from(new Set(booksFilteredByClassification.map((book) => book.category)))
  }, [booksFilteredByClassification])

  // Reset category when changing classification if the category doesn't exist in the new classification
  useEffect(() => {
    if (activeCategory !== "All" && !availableCategories.includes(activeCategory)) {
      setActiveCategory("All")
    }
  }, [availableCategories, activeCategory]) // Removed activeClassification from dependencies

  // Final filtered books based on all criteria
  const filteredBooks = useMemo(() => {
    return booksWithImages.filter((book) => {
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
  }, [booksWithImages, searchQuery, activeCategory, activeClassification])

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
          <MyBookCard
            key={book.slug}
            book={{
              title: book.title,
              subtitle: book.subtitle,
              slug: book.slug,
              excerpt: "",
              feature_image: book.feature_image || "",
              published_at: "",
              authors: book.authors,
            }}
          />
        ))}
        {filteredBooks.length === 0 && (
          <p className="text-center text-muted-foreground py-8 col-span-2">No books found matching your criteria.</p>
        )}
      </div>
    </div>
  )
}

