import { getFavoriteMovies } from "@/lib/trakt-api"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

  console.log(`Fetching favorite movies with limit ${limit} from API`)
  try {
    const movies = await getFavoriteMovies(limit)
    console.log(`Retrieved ${movies.length} favorite movies`)
    return NextResponse.json(movies)
  } catch (error) {
    console.error("Error fetching favorite movies:", error)
    return NextResponse.json({ error: "Failed to fetch favorite movies" }, { status: 500 })
  }
}

