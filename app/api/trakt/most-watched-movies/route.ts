import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Use static rendering instead of dynamic
export const dynamic = 'force-static';

export async function GET() {
  try {
    // Use a fixed limit
    const limit = 10;
    
    // Read from the JSON file instead of API
    const filePath = path.join(process.cwd(), "data", "film", "movies.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const allMovies = JSON.parse(fileContents)
    
    // Sort by play_count to get most watched and limit the results
    const sortedMovies = allMovies.sort((a, b) => (b.play_count || 0) - (a.play_count || 0))
    const mostWatchedMovies = sortedMovies.slice(0, limit)
    
    console.log(`Retrieved ${mostWatchedMovies.length} most watched movies from JSON file`)
    return NextResponse.json(mostWatchedMovies)
  } catch (error) {
    console.error("Error fetching most watched movies from JSON:", error)
    return NextResponse.json({ error: "Failed to fetch most watched movies" }, { status: 500 })
  }
}

