import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { readdir, readFile, writeFile } from "fs/promises"
import path from "path"

const dataDirectory = path.join(process.cwd(), "data")

// Mock type for collection item
interface CollectionItem {
  id: string
  name: string
  description: string
}

export async function GET(request: Request) {
  try {
    const files = await readdir(dataDirectory)
    const jsonFiles = files.filter((file) => file.endsWith(".json"))

    const collections: CollectionItem[] = []

    for (const file of jsonFiles) {
      const filePath = path.join(dataDirectory, file)
      const fileContent = await readFile(filePath, "utf-8")
      try {
        const jsonData = JSON.parse(fileContent)
        if (
          jsonData &&
          typeof jsonData === "object" &&
          "id" in jsonData &&
          "name" in jsonData &&
          "description" in jsonData
        ) {
          collections.push(jsonData as CollectionItem) // Type assertion here
        } else {
          console.warn(`Skipping file ${file} due to invalid JSON structure.`)
        }
      } catch (parseError) {
        console.error(`Error parsing JSON from file ${file}:`, parseError)
      }
    }

    return NextResponse.json(collections)
  } catch (error) {
    console.error("Error reading local collections:", error)
    return NextResponse.json({ error: "Failed to read local collections" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json()

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    const id = uuidv4()
    const newCollectionItem = { id, name, description }
    const filePath = path.join(dataDirectory, `${id}.json`)

    await writeFile(filePath, JSON.stringify(newCollectionItem, null, 2))

    return NextResponse.json(newCollectionItem, { status: 201 })
  } catch (error) {
    console.error("Error creating local collection:", error)
    return NextResponse.json({ error: "Failed to create local collection" }, { status: 500 })
  }
}

