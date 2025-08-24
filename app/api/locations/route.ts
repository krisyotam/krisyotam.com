import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"

export async function GET() {
  try {
    // Get the path to the locations.json file from the root 'data' folder
    const filePath = path.join(process.cwd(), "data", "locations.json")

    // Read the file
    const fileData = await fs.readFile(filePath, "utf8")

    // Parse the JSON data
    const locations = JSON.parse(fileData)

    // Return the data as JSON
    return NextResponse.json(locations)
  } catch (error) {
    console.error("Error loading locations:", error)

    // Return fallback data if there's an error
    return NextResponse.json(
      [
        {
          name: "DoubleTree by Hilton Hotel Niagara Falls, Niagara Falls, New York",
          description: "A family-friendly hotel located near the falls with comfortable rooms.",
          coordinates: [-79.0605, 43.0852],
          type: "hotel",
        },
        {
          name: "Radisson Hotel & Suites Fallsview, Niagara Falls, Ontario",
          description: "A hotel located in Canada with fantastic views of the falls.",
          coordinates: [-79.0872, 43.0845],
          type: "hotel",
        },
        {
          name: "New York City",
          description: "The most populous city in the United States.",
          coordinates: [-74.006, 40.7128],
          type: "city",
        },
        {
          name: "Niagara Falls",
          description: "A group of three waterfalls at the southern end of Niagara Gorge.",
          coordinates: [-79.0849, 43.0896],
          type: "place",
        },
        {
          name: "JFK International Airport",
          description: "One of the busiest international air passenger gateways in the United States.",
          coordinates: [-73.7781, 40.6413],
          type: "airport",
        },
      ],
      { status: 500 },
    )
  }
}
