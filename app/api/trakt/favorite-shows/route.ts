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
    const filePath = path.join(process.cwd(), "data", "film", "shows.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const allShows = JSON.parse(fileContents)
    
    // Sort by rating to get favorites and limit the results
    const sortedShows = allShows.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    const favoriteShows = sortedShows.slice(0, limit)
    
    console.log(`Retrieved ${favoriteShows.length} favorite shows from JSON file`)
    return NextResponse.json(favoriteShows)
  } catch (error) {
    console.error("Error fetching favorite shows from JSON:", error)
    return NextResponse.json({ error: "Failed to fetch favorite shows" }, { status: 500 })
  }
}

