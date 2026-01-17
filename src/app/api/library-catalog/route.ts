import { NextResponse } from "next/server"
import { getLibraryBooks } from "@/lib/media-db"

export async function GET() {
  try {
    const books = getLibraryBooks()
    return NextResponse.json(books)
  } catch (error) {
    console.error("Error reading library catalog:", error)
    return NextResponse.json({ error: "Failed to fetch library catalog" }, { status: 500 })
  }
}

