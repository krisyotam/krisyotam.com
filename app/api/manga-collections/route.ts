import { NextResponse } from "next/server"
import mangaList from "@/data/manga-list.json"

export async function GET() {
  try {
    return NextResponse.json(mangaList)
  } catch (error) {
    console.error("Error fetching manga collections:", error)
    return NextResponse.json({ error: "Failed to fetch manga collections" }, { status: 500 })
  }
}

