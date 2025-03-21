import { NextResponse } from "next/server"
import mangaData from "@/data/manga.json"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Manga ID is required" }, { status: 400 })
    }

    // @ts-ignore - We know the structure of our JSON
    const manga = mangaData[id]

    if (!manga) {
      return NextResponse.json({ error: "Manga not found" }, { status: 404 })
    }

    return NextResponse.json(manga)
  } catch (error) {
    console.error("Error fetching manga entry:", error)
    return NextResponse.json({ error: "Failed to fetch manga entry" }, { status: 500 })
  }
}

