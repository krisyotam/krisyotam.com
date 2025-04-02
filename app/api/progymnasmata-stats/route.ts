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
function countEntries(data: any): number {
  if (!data) return 0

  // If it's an array at the root level
  if (Array.isArray(data)) {
    return data.length
  }

  // Look for common keys that might contain arrays
  const possibleArrayKeys = ["entries", "items", "exercises", "examples", "data"]

  for (const key of possibleArrayKeys) {
    if (data[key] && Array.isArray(data[key])) {
      return data[key].length
    }
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
  // Read all the progymnasmata JSON files
  const chreia = readJsonFile("data/progymnasmata/chreia.json")
  const commonplace = readJsonFile("data/progymnasmata/commonplace.json")
  const comparison = readJsonFile("data/progymnasmata/comparison.json")
  const confirmation = readJsonFile("data/progymnasmata/confirmation.json")
  const description = readJsonFile("data/progymnasmata/description.json")
  const encomium = readJsonFile("data/progymnasmata/encomium.json")
  const fable = readJsonFile("data/progymnasmata/fable.json")
  const impersonation = readJsonFile("data/progymnasmata/impersonation.json")
  const introductionOfLaw = readJsonFile("data/progymnasmata/introduction-of-a-law.json")
  const maxim = readJsonFile("data/progymnasmata/maxim.json")
  const narrative = readJsonFile("data/progymnasmata/narrative.json")
  const refutation = readJsonFile("data/progymnasmata/refutation.json")
  const thesis = readJsonFile("data/progymnasmata/thesis.json")
  const vituperation = readJsonFile("data/progymnasmata/vituperation.json")

  // Count the entries in each file
  const stats = {
    chreia: countEntries(chreia),
    commonplace: countEntries(commonplace),
    comparison: countEntries(comparison),
    confirmation: countEntries(confirmation),
    description: countEntries(description),
    encomium: countEntries(encomium),
    fable: countEntries(fable),
    impersonation: countEntries(impersonation),
    introductionOfLaw: countEntries(introductionOfLaw),
    maxim: countEntries(maxim),
    narrative: countEntries(narrative),
    refutation: countEntries(refutation),
    thesis: countEntries(thesis),
    vituperation: countEntries(vituperation),
  }

  return NextResponse.json(stats)
}

