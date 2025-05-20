// app/api/trakt/most-watched-genres/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Use static rendering
export const dynamic = 'force-static';

export async function GET() {
  console.log("Providing static most watched genres data");
  try {
    // Read movies and shows from JSON files
    const moviesPath = path.join(process.cwd(), "data", "film", "movies.json");
    const showsPath = path.join(process.cwd(), "data", "film", "shows.json");
    
    const moviesData = JSON.parse(fs.readFileSync(moviesPath, "utf8"));
    const showsData = JSON.parse(fs.readFileSync(showsPath, "utf8"));
    
    // Combine all genres from both movies and shows
    const allItems = [...moviesData, ...showsData];
    
    // Count occurrences of each genre
    const genreCounts = {};
    allItems.forEach(item => {
      if (item.genres && Array.isArray(item.genres)) {
        item.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });
    
    // Convert to array and sort
    const sortedGenres = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    console.log(`Generated ${sortedGenres.length} most watched genres from JSON files`);
    return NextResponse.json(sortedGenres);
  } catch (error) {
    console.error("Error generating most watched genres:", error);
    // Return an empty array instead of an error
    return NextResponse.json([]);
  }
}
