import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const progymnasmataDir = path.join(process.cwd(), "data", "progymnasmata")

    // Get all JSON files in the directory
    const files = fs.readdirSync(progymnasmataDir).filter((file) => file.endsWith(".json"))

    // Read and parse each file
    let allEntries: any[] = []

    for (const file of files) {
      const filePath = path.join(progymnasmataDir, file)
      const fileContent = fs.readFileSync(filePath, "utf8")
      const entries = JSON.parse(fileContent)

      // Add the type based on the filename
      const type = file.replace(".json", "")
      const entriesWithType = entries.map((entry: any) => ({
        ...entry,
        type: formatType(type),
      }))

      allEntries = [...allEntries, ...entriesWithType]
    }

    return NextResponse.json(allEntries)
  } catch (error) {
    console.error("Error reading progymnasmata data:", error)
    return NextResponse.json({ error: "Failed to fetch progymnasmata data" }, { status: 500 })
  }
}

// Helper function to format the type name
function formatType(type: string): string {
  // Convert kebab-case to Title Case
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

