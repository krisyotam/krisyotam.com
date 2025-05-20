import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Use static rendering
export const dynamic = 'force-static';

export async function GET() {
  try {
    // Use a fixed limit
    const limit = 10;
    
    // Read from the JSON file instead of API
    const filePath = path.join(process.cwd(), "data", "film", "movies.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const allMovies = JSON.parse(fileContents)
    
    // Sort by rating to get favorites and limit the results
    const sortedMovies = allMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    const favoriteMovies = sortedMovies.slice(0, limit)
    
    console.log(`Retrieved ${favoriteMovies.length} favorite movies from JSON file`)
    return NextResponse.json(favoriteMovies)
  } catch (error) {
    console.error("Error fetching favorite movies from JSON:", error)
    return NextResponse.json({ error: "Failed to fetch favorite movies" }, { status: 500 })
  }
}

