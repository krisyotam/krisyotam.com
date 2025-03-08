"use client"

import { useState, useEffect } from "react"
import { getFeaturedImage } from "../../utils/ghost"
import ocsData from "../../data/ocs.json"
import worldsData from "../../data/worlds.json"
import { CharacterCard } from "../../components/character-card"
import { BookSearch } from "../../components/book-search"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import FictionWorld from "@/components/fiction-world"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = "force-dynamic"

// Define types for our data structures
interface Character {
  name: string
  slug: string
  book: string
  status: string
  feature_image?: string
}

interface World {
  name: string
  description: string
  slug: string
  status: string
  books: string[]
  feature_image?: string
}

export default function OCsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeView, setActiveView] = useState("characters")

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
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
            <DialogTitle className="text-2xl font-semibold">
              {activeView === "characters" ? "About OCs" : "About Fictional Worlds"}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              {activeView === "characters"
                ? "This page showcases the original characters (OCs) from my books and series. Each character card provides a glimpse into their world and story."
                : "This page showcases the fictional worlds from my books and series. Each world has its own unique characteristics, cultures, and stories."}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function WorldsList({ worlds }: { worlds: World[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [worldsWithImages, setWorldsWithImages] = useState<World[]>(worlds)

  useEffect(() => {
    const fetchFeaturedImages = async () => {
      try {
        console.log("Fetching featured images for worlds...")
        const updatedWorlds = await Promise.all(
          worlds.map(async (world: World) => {
            try {
              const featuredImage = await getFeaturedImage(world.slug)
              console.log(`Fetched image for ${world.name}:`, featuredImage)
              return {
                ...world,
                feature_image:
                  featuredImage && featuredImage !== "null" ? featuredImage : "/placeholder.svg?height=600&width=800",
              }
            } catch (error) {
              console.error(`Error fetching image for ${world.name}:`, error)
              return { ...world, feature_image: "/placeholder.svg?height=600&width=800" }
            }
          }),
        )
        console.log("All featured images fetched successfully")
        setWorldsWithImages(updatedWorlds)
      } catch (error) {
        console.error("Error fetching featured images:", error)
        setWorldsWithImages(
          worlds.map((world) => ({ ...world, feature_image: "/placeholder.svg?height=600&width=800" })),
        )
      }
    }

    fetchFeaturedImages()
  }, [worlds])

  // Get all unique categories (books)
  const allCategories = Array.from(new Set(worlds.flatMap((world) => world.books))).filter((book): book is string =>
    Boolean(book),
  )

  const filteredWorlds = worldsWithImages.filter((world) => {
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
            imageSrc={world.feature_image || "/placeholder.svg?height=600&width=800"}
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
  const [charactersWithImages, setCharactersWithImages] = useState<Character[]>(initialCharacters)

  useEffect(() => {
    const fetchFeaturedImages = async () => {
      try {
        console.log("Fetching featured images for characters...")
        const updatedCharacters = await Promise.all(
          initialCharacters.map(async (character: Character) => {
            try {
              const featuredImage = await getFeaturedImage(character.slug)
              console.log(`Fetched image for ${character.name}:`, featuredImage)
              return {
                ...character,
                feature_image: featuredImage && featuredImage !== "null" ? featuredImage : "/placeholder-square.svg",
              }
            } catch (error) {
              console.error(`Error fetching image for ${character.name}:`, error)
              return { ...character, feature_image: "/placeholder-square.svg" }
            }
          }),
        )
        console.log("All featured images fetched successfully")
        setCharactersWithImages(updatedCharacters)
      } catch (error) {
        console.error("Error fetching featured images:", error)
        setCharactersWithImages(
          initialCharacters.map((character) => ({ ...character, feature_image: "/placeholder-square.svg" })),
        )
      }
    }

    fetchFeaturedImages()
  }, [initialCharacters])

  const categories = Array.from(new Set(initialCharacters.map((character) => character.book)))

  const filteredCharacters = charactersWithImages.filter((character) => {
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
            imageUrl={character.feature_image || "/placeholder-square.svg"}
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

