import { NextResponse } from "next/server"
import { getUserProfile, getUserAnimeList, getUserMangaList, getUserFavorites } from "@/lib/mal-api"

export async function GET() {
  try {
    // Get environment variables
    const accessToken = process.env.MAL_ACCESS_TOKEN
    const username = "krisyotam" // Hardcoded username

    if (!accessToken) {
      return NextResponse.json({ error: "Missing MAL_ACCESS_TOKEN environment variable" }, { status: 500 })
    }

    // Get user profile
    const profile = await getUserProfile(accessToken)

    // Get anime lists with error handling
    let watching = []
    let completed = []
    try {
      watching = await getUserAnimeList(accessToken, "watching")
    } catch (error) {
      console.error("Error fetching watching anime:", error)
      // Continue with empty array
    }

    try {
      completed = await getUserAnimeList(accessToken, "completed")
    } catch (error) {
      console.error("Error fetching completed anime:", error)
      // Continue with empty array
    }

    // Get manga lists with error handling
    let reading = []
    let completedManga = []
    try {
      reading = await getUserMangaList(accessToken, "reading")
    } catch (error) {
      console.error("Error fetching reading manga:", error)
      // Continue with empty array
    }

    try {
      completedManga = await getUserMangaList(accessToken, "completed")
    } catch (error) {
      console.error("Error fetching completed manga:", error)
      // Continue with empty array
    }

    // Get favorites
    let favorites = { anime: [], manga: [], characters: [] }
    try {
      favorites = await getUserFavorites(username, accessToken)
    } catch (error) {
      console.error("Error fetching favorites:", error)
      // Continue with empty object
    }

    // Return all data
    return NextResponse.json({
      profile,
      anime: {
        watching,
        completed,
      },
      manga: {
        reading,
        completedManga,
      },
      favorites,
    })
  } catch (error) {
    console.error("Error in user-data API route:", error)
    return NextResponse.json({ error: "Failed to fetch user data", details: error.message }, { status: 500 })
  }
}

