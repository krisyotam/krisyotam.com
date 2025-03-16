import { NextResponse } from "next/server"
import { getAnimeById } from "@/lib/mal-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 })
    }

    const data = await getAnimeById(Number.parseInt(id))
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching anime by ID:", error)
    return NextResponse.json({ error: "Failed to fetch anime" }, { status: 500 })
  }
}

