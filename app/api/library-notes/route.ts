import { NextResponse } from "next/server"
import { getLibraryNotes } from "@/lib/media-db"

export async function GET() {
  try {
    const notes = getLibraryNotes()
    return NextResponse.json({ notes })
  } catch (error) {
    console.error("Error reading library notes:", error)
    return NextResponse.json({ error: "Failed to fetch library notes" }, { status: 500 })
  }
}

