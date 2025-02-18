"use client"

import { useState, useEffect } from "react"
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

export const dynamic = "force-dynamic"

type Book = {
  subtitle: string
  title: string
  category: string
  tags: string[]
  authors: string[]
  slug: string
  feature_image?: string
}

export default function MyBooksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
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

  const categories = Array.from(new Set(initialBooks.map((book) => book.category)))

  const filteredBooks = booksWithImages.filter((book) => {
    const matchesSearch =
      searchQuery === "" ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      book.authors.some((author: string) => author.toLowerCase().includes(searchQuery.toLowerCase()))

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

