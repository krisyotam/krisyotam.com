import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Use static rendering
export const dynamic = 'force-static';

export async function GET() {
  console.log("Providing static watched counts data")
  try {
    // Static watched counts data
    const watchedData = {
      movies: {
        watched: 750,
        minutes: 108000
      },
      shows: {
        watched: 120
      },
      episodes: {
        watched: 2400,
        minutes: 72000
      }
    }
    
    console.log("Static watched counts data:", watchedData)
    return NextResponse.json(watchedData)
  } catch (error) {
    console.error("Error providing watched counts:", error)
    return NextResponse.json({ error: "Failed to provide watched counts" }, { status: 500 })
  }
}

