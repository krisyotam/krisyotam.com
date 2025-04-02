import { getMostWatchedShows } from "@/lib/trakt-api"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

  console.log(`Fetching most watched shows with limit ${limit} from API`)
  try {
    const shows = await getMostWatchedShows(limit)
    console.log(`Retrieved ${shows.length} most watched shows`)
    return NextResponse.json(shows)
  } catch (error) {
    console.error("Error fetching most watched shows:", error)
    return NextResponse.json({ error: "Failed to fetch most watched shows" }, { status: 500 })
  }
}

