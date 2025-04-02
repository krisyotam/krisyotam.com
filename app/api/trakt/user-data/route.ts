import { getUserProfile } from "@/lib/trakt-api"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Try to get the real profile data
    try {
      const profileData = await getUserProfile()
      console.log("Retrieved user profile from Trakt API")

      // Return the profile with our overrides
      return NextResponse.json({
        ...profileData,
        username: "krisyotam",
        name: "Kris Yotam",
        about:
          "Film enthusiast and creator. I love exploring stories across different mediums and analyzing the art of visual storytelling.",
        location: "Digital Nomad",
      })
    } catch (error) {
      console.error("Failed to get profile from API, using fallback data:", error)

      // Fallback to hardcoded data if API fails
      const userData = {
        username: "krisyotam",
        name: "Kris Yotam",
        images: {
          avatar: {
            full: "/placeholder.svg?height=96&width=96",
          },
        },
        about:
          "Film enthusiast and creator. I love exploring stories across different mediums and analyzing the art of visual storytelling.",
        joined_at: "2020-01-15T00:00:00.000Z",
        location: "Digital Nomad",
        vip: true,
      }

      return NextResponse.json(userData)
    }
  } catch (error) {
    console.error("Error in user-data route:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}

