import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Helper function to safely read JSON files
function readJsonFile(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, "utf8")
      return JSON.parse(fileContents)
    }
    return null
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return null
  }
}

// Helper function to count entries in a JSON file, handling different formats
function countEntries(data: any, expectedKey: string): number {
  if (!data) return 0

  // If it's an array at the root level
  if (Array.isArray(data)) {
    return data.length
  }

  // If it has the expected key as an array
  if (data[expectedKey] && Array.isArray(data[expectedKey])) {
    return data[expectedKey].length
  }

  // Try common plural keys
  const pluralKey = `${expectedKey}s`
  if (data[pluralKey] && Array.isArray(data[pluralKey])) {
    return data[pluralKey].length
  }

  // Look for any array property in the object
  for (const key in data) {
    if (Array.isArray(data[key])) {
      return data[key].length
    }
  }

  // If we can't find any arrays, return 0
  return 0
}

export async function GET() {
  // Read all the JSON files
  const feed = readJsonFile("data/feed.json")
  const newsletters = readJsonFile("data/newsletters.json")
  const nuggets = readJsonFile("data/nuggets.json")
  const notes = readJsonFile("data/quick-notes.json")
  const research = readJsonFile("data/research.json")
  const speeches = readJsonFile("data/speeches.json")
  const books = readJsonFile("data/mybooks.json")
  const keynotes = readJsonFile("data/keynotes.json")
  const quotes = readJsonFile("data/quotes.json")
  const poems = readJsonFile("data/poems.json")
  const characters = readJsonFile("data/ocs.json")
  const certifications = readJsonFile("data/certifications.json")

  // Count the entries in each file, handling different JSON structures
  const stats = {
    posts: countEntries(feed, "post"),
    newsletters: countEntries(newsletters, "newsletter"),
    nuggets: countEntries(nuggets, "nugget"),
    notes: countEntries(notes, "note"),
    research: countEntries(research, "project"),
    speeches: countEntries(speeches, "speech"),
    books: countEntries(books, "book"),
    keynotes: countEntries(keynotes, "keynote"),
    quotes: countEntries(quotes, "quote"),
    poems: countEntries(poems, "poem"),
    characters: countEntries(characters, "character"),
    certifications: countEntries(certifications, "certification"),
  }

  return NextResponse.json(stats)
}

