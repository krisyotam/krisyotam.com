"use client"

import { useState } from "react"
import ocsData from "../../data/ocs.json"
import worldsData from "../../data/worlds.json"
import { CharacterCard } from "../../components/character-card"
import FictionWorld from "../../components/fiction-world"
import { BookSearch } from "../../components/book-search"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"
import { PageDescription } from "@/components/posts/typography/page-description"

export const dynamic = "force-dynamic"

// Add OCS page metadata after other imports
const ocsPageData = {
  title: "Characters",
  subtitle: "Fictional Characters and Worlds",
  date: new Date().toISOString(),
  preview: "A showcase of original characters and fictional worlds from my books and creative writing projects.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 6,
}

// Define types for our data structures
interface Character {
  name: string
  slug: string
  book: string
  status: string
  photo?: string
}

interface World {
  name: string
  description: string
  slug: string
  status: string
  books: string[]
  photo?: string
}

export default function OCsPage() {
  const [activeView, setActiveView] = useState("characters")

  // In the return statement, add the PageHeader component before the Tabs component
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        {/* Add the PageHeader component */}
        <PageHeader
          title={ocsPageData.title}
          subtitle={ocsPageData.subtitle}
          date={ocsPageData.date}
          preview={ocsPageData.preview}
          status={ocsPageData.status}
          confidence={ocsPageData.confidence}
          importance={ocsPageData.importance}
        />

        <Tabs defaultValue="characters" className="mb-8" onValueChange={setActiveView}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="characters">Characters</TabsTrigger>
            <TabsTrigger value="worlds">Worlds</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeView === "characters" ? (
          <CharacterList initialCharacters={ocsData.characters as Character[]} />
        ) : (
          <WorldsList worlds={worldsData.worlds as World[]} />
        )}
      </div>
      
      {/* PageDescription component with dynamic content based on activeView */}
      <PageDescription
        title={activeView === "characters" ? "About OCs" : "About Fictional Worlds"}
        description={
          activeView === "characters"
            ? "This page showcases the original characters (OCs) from my books and series. Each character card provides a glimpse into their world and story."
            : "This page showcases the fictional worlds from my books and series. Each world has its own unique characteristics, cultures, and stories."
        }
      />
    </div>
  )
}

function WorldsList({ worlds }: { worlds: World[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  // Get all unique categories (books)
  const allCategories = Array.from(new Set(worlds.flatMap((world) => world.books))).filter((book): book is string =>
    Boolean(book),
  )

  const filteredWorlds = worlds.filter((world) => {
    const matchesSearch =
      searchQuery === "" ||
      world.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      world.books.some((book) => book.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (world.description && world.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === "All" || world.books.includes(activeCategory)
    return matchesSearch && matchesCategory && world.status === "active"
  })

  return (
    <div className="space-y-6">
      <BookSearch onSearch={setSearchQuery} />
      <div className="flex flex-wrap gap-2">
        <Button
          key="all-worlds"
          variant={activeCategory === "All" ? "default" : "secondary"}
          onClick={() => setActiveCategory("All")}
        >
          All Books
        </Button>
        {allCategories.map((category) => (
          <Button
            key={`category-${category}`}
            variant={category === activeCategory ? "default" : "secondary"}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredWorlds.map((world) => (
          <FictionWorld
            key={world.slug}
            name={world.name}
            novel={world.books[0] || "Upcoming"}
            imageSrc={world.photo || "/placeholder.svg?height=600&width=800"}
            slug={world.slug}
            author="Kris Yotam"
          />
        ))}
        {filteredWorlds.length === 0 && (
          <p className="text-center text-muted-foreground py-8 col-span-2">No worlds found matching your criteria.</p>
        )}
      </div>
    </div>
  )
}

function CharacterList({ initialCharacters }: { initialCharacters: Character[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = Array.from(new Set(initialCharacters.map((character) => character.book)))

  const filteredCharacters = initialCharacters.filter((character) => {
    const matchesSearch =
      searchQuery === "" ||
      character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      character.book.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = activeCategory === "All" || character.book === activeCategory

    return matchesSearch && matchesCategory && character.status === "active"
  })

  return (
    <div className="space-y-6">
      <BookSearch onSearch={setSearchQuery} />
      <div className="flex flex-wrap gap-2">
        <Button
          key="all-characters"
          variant={activeCategory === "All" ? "default" : "secondary"}
          onClick={() => setActiveCategory("All")}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={`category-${category}`}
            variant={category === activeCategory ? "default" : "secondary"}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredCharacters.map((character) => (
          <CharacterCard
            key={character.slug}
            imageUrl={character.photo || "/placeholder-square.svg"}
            name={character.name}
            book={character.book}
            slug={character.slug}
          />
        ))}
        {filteredCharacters.length === 0 && (
          <p className="text-center text-muted-foreground py-8 col-span-2">
            No characters found matching your criteria.
          </p>
        )}
      </div>
    </div>
  )
}

