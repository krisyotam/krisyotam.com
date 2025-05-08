"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatFileSize } from "@/lib/utils"

interface FlashcardDeck {
  name: string
  date: string
  fileName?: string
  link: string
  description: string
  size?: number
}

export default function MochiClientPage() {
  const [decks, setDecks] = useState<FlashcardDeck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null)

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await fetch("/api/flashcards")
        if (!response.ok) {
          throw new Error("Failed to fetch flashcard decks")
        }
        const data = await response.json()
        setDecks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchDecks()
  }, [])

  const handleDeckClick = (deck: FlashcardDeck) => {
    setSelectedDeck(deck)
  }

  const handleBack = () => {
    setSelectedDeck(null)
  }

  const handleOpenLink = (deck: FlashcardDeck) => {
    window.open(deck.link, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return <div className="text-center py-8">Loading flashcard decks...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>
  }

  if (selectedDeck) {
    return (
      <div className="bg-card border border-border p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to decks
          </Button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{selectedDeck.name}</h2>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <span>Added: {new Date(selectedDeck.date).getFullYear()}</span>
            {selectedDeck.size && <span className="ml-4">Size: {formatFileSize(selectedDeck.size)}</span>}
          </div>

          <div className="prose dark:prose-invert max-w-none mb-6">
            <p>{selectedDeck.description}</p>
          </div>

          <Button onClick={() => handleOpenLink(selectedDeck)}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Deck
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="font-mono">
      <div className="grid grid-cols-2 text-sm text-muted-foreground mb-2 px-4">
        <div>year</div>
        <div>title</div>
      </div>

      <div className="border-t border-border">
        {decks.length > 0 ? (
          decks.map((deck, index) => (
            <div
              key={index}
              onClick={() => handleDeckClick(deck)}
              className="grid grid-cols-2 px-4 py-3 border-b border-border hover:bg-secondary/50 transition-colors duration-200 cursor-pointer"
            >
              <div className="text-sm text-muted-foreground">{new Date(deck.date).getFullYear()}</div>
              <div>{deck.name}</div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">No flashcard decks found</div>
        )}
      </div>
    </div>
  )
}
