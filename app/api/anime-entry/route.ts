import { NextResponse } from "next/server"
import animeData from "@/data/anime.json"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Anime ID is required" }, { status: 400 })
    }

    // @ts-ignore - We know the structure of our JSON
    const anime = animeData[id]

    if (!anime) {
      return NextResponse.json({ error: "Anime not found" }, { status: 404 })
    }

    return NextResponse.json(anime)
  } catch (error) {
    console.error("Error fetching anime entry:", error)
    return NextResponse.json({ error: "Failed to fetch anime entry" }, { status: 500 })
  }
}

