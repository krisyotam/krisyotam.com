import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { promisify } from "util"


export const dynamic = 'force-dynamic';
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const readFile = promisify(fs.readFile)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    const promptsDir = path.join(process.cwd(), "prompts")

    // If a specific file is requested, return its contents
    if (filename) {
      const filePath = path.join(promptsDir, filename)

      // Check if file exists and is within the prompts directory (security check)
      if (!filePath.startsWith(promptsDir)) {
        return NextResponse.json({ error: "Invalid file path" }, { status: 400 })
      }

      try {
        const fileStats = await stat(filePath)

        // Make sure it's a file, not a directory
        if (!fileStats.isFile()) {
          return NextResponse.json({ error: "Not a file" }, { status: 400 })
        }

        const content = await readFile(filePath, "utf8")
        return NextResponse.json({
          name: filename,
          content,
          size: fileStats.size,
          modified: fileStats.mtime,
        })
      } catch (error) {
        return NextResponse.json({ error: "File not found" }, { status: 404 })
      }
    }

    // Otherwise, return a list of all files in the prompts directory
    const files = await readdir(promptsDir)

    // Get file stats for each file
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(promptsDir, file)
        const stats = await stat(filePath)

        // Only include files, not directories
        if (stats.isFile()) {
          return {
            name: file,
            size: stats.size,
            modified: stats.mtime,
          }
        }
        return null
      }),
    )

    // Filter out directories and sort by modified date (newest first)
    const promptFiles = fileStats.filter(Boolean).sort((a, b) => b!.modified.getTime() - a!.modified.getTime())

    return NextResponse.json({ files: promptFiles })
  } catch (error) {
    console.error("Error in prompts API:", error)
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 })
  }
}

