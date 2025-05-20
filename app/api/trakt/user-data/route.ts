import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const dynamic = 'force-static';

export async function GET() {
  try {
    // Static user data instead of API call
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

    console.log("Using static user profile data")
    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error in user-data route:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}

