import { getRecentlyWatchedMovies } from "@/lib/trakt-api"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

  console.log(`Fetching recent movies with limit ${limit} from API`)
  try {
    const movies = await getRecentlyWatchedMovies(limit)
    console.log(`Retrieved ${movies.length} recent movies`)
    return NextResponse.json(movies)
  } catch (error) {
    console.error("Error fetching recently watched movies:", error)
    return NextResponse.json({ error: "Failed to fetch recently watched movies" }, { status: 500 })
  }
}

