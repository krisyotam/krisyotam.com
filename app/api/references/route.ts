import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// GET handler to fetch references data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    // Path to the references JSON file
    const filePath = path.join(process.cwd(), "data", "references.json")
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "References data not found" }, { status: 404 })
    }
    
    // Read and parse the file
    const fileContents = fs.readFileSync(filePath, "utf8")
    const references = JSON.parse(fileContents)
    
    // If a specific reference ID is requested, return that reference
    if (id) {
      const reference = references.find((ref: any) => ref.id === id)
      
      if (!reference) {
        return NextResponse.json({ error: "Reference not found" }, { status: 404 })
      }
      
      return NextResponse.json(reference)
    }
    
    // Otherwise return all references
    return NextResponse.json(references)
  } catch (error) {
    console.error("Error fetching references:", error)
    return NextResponse.json({ error: "Failed to fetch references" }, { status: 500 })
  }
} 