import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

interface FlashcardDeck {
  name: string
  date: string
  link: string
  description: string
  fileName?: string
  size?: number
}

export async function GET() {
  try {
    // Read the mochi.json file
    const dataPath = path.join(process.cwd(), "data", "mochi.json")
    const fileData = fs.readFileSync(dataPath, "utf8")
    const decks: FlashcardDeck[] = JSON.parse(fileData)

    // Sort by date (newest first)
    decks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json(decks)
  } catch (error) {
    console.error("Error fetching flashcard decks:", error)
    return NextResponse.json({ error: "Failed to fetch flashcard decks" }, { status: 500 })
  }
}
