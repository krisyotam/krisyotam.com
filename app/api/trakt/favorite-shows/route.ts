import { getFavoriteShows } from "@/lib/trakt-api"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

  console.log(`Fetching favorite shows with limit ${limit} from API`)
  try {
    const shows = await getFavoriteShows(limit)
    console.log(`Retrieved ${shows.length} favorite shows`)
    return NextResponse.json(shows)
  } catch (error) {
    console.error("Error fetching favorite shows:", error)
    return NextResponse.json({ error: "Failed to fetch favorite shows" }, { status: 500 })
  }
}

