import { getMostWatchedMovies } from "@/lib/trakt-api"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

  console.log(`Fetching most watched movies with limit ${limit} from API`)
  try {
    const movies = await getMostWatchedMovies(limit)
    console.log(`Retrieved ${movies.length} most watched movies`)
    return NextResponse.json(movies)
  } catch (error) {
    console.error("Error fetching most watched movies:", error)
    return NextResponse.json({ error: "Failed to fetch most watched movies" }, { status: 500 })
  }
}

