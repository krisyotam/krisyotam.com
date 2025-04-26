import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

interface FlashcardDeck {
  name: string
  date: string
  fileName: string
  type: "mochi" | "anki"
  description: string
  size?: number
}

export async function GET() {
  try {
    // Read the mochi.json file
    const dataPath = path.join(process.cwd(), "data", "mochi.json")
    const fileData = fs.readFileSync(dataPath, "utf8")
    const decks: FlashcardDeck[] = JSON.parse(fileData)

    // Add file size information
    const decksWithSize = decks.map((deck) => {
      try {
        const filePath = path.join(process.cwd(), "public", "flashcards", deck.type, deck.fileName)
        const stats = fs.statSync(filePath)
        return {
          ...deck,
          size: stats.size,
        }
      } catch (error) {
        // If file doesn't exist, return deck without size
        return deck
      }
    })

    // Sort by date (newest first)
    decksWithSize.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json(decksWithSize)
  } catch (error) {
    console.error("Error fetching flashcard decks:", error)
    return NextResponse.json({ error: "Failed to fetch flashcard decks" }, { status: 500 })
  }
}
