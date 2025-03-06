import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the absolute path to the data directory
    const dataDirectory = path.join(process.cwd(), "data")
    const filePath = path.join(dataDirectory, "research.json")

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error("Research data file not found at:", filePath)
      return res.status(404).json({ error: "Research data file not found" })
    }

    // Read and parse the file
    const fileContents = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(fileContents)

    return res.status(200).json(data)
  } catch (error) {
    console.error("Error reading research data:", error)
    return res.status(500).json({ error: "Failed to load research data" })
  }
}
