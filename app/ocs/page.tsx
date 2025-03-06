"use client"

import { useState, useEffect } from "react"
import { getFeaturedImage } from "../../utils/ghost"
import ocsData from "../../data/ocs.json"
import { CharacterCard } from "../../components/character-card"
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

type Character = {
  slug: string;
  name: string;
  book: string;
  status: string;
  feature_image?: string;
}

export default function OCsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <CharacterList initialCharacters={ocsData.characters} />
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
            <DialogTitle className="text-2xl font-semibold">About OCs</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              This page showcases the original characters (OCs) from my books and series. Each character card provides a
              glimpse into their world and story. Click on a character to learn more about them.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CharacterList({ initialCharacters }: { initialCharacters: Character[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [charactersWithImages, setCharactersWithImages] = useState(initialCharacters)

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
          initialCharacters.map((character) => ({ 
            ...character, 
            feature_image: "/placeholder-square.svg"
          }))
        )
      }
    }

    fetchFeaturedImages()
  }, [initialCharacters])

  const categories = Array.from(new Set(initialCharacters.map((character: Character) => character.book)))

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
        {filteredCharacters.map((character: Character) => (
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

