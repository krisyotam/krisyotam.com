import { NextResponse } from "next/server"
import animeList from "@/data/anime-list.json"

export async function GET() {
  try {
    return NextResponse.json(animeList)
  } catch (error) {
    console.error("Error fetching anime collections:", error)
    return NextResponse.json({ error: "Failed to fetch anime collections" }, { status: 500 })
  }
}

