import { NextResponse } from "next/server"
import newsletters from "@/data/newsletters.json"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")?.toLowerCase() || ""
    const year = searchParams.get("year") || ""

    let filteredNewsletters = [...newsletters]

    // Filter by search query
    if (query) {
      filteredNewsletters = filteredNewsletters.filter(
        (newsletter) =>
          newsletter.title.toLowerCase().includes(query) ||
          newsletter.description.toLowerCase().includes(query) ||
          newsletter.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Filter by year
    if (year && year !== "all") {
      filteredNewsletters = filteredNewsletters.filter((newsletter) => newsletter.year === year)
    }

    return NextResponse.json(filteredNewsletters)
  } catch (error) {
    console.error("Error fetching newsletters:", error)
    return NextResponse.json({ error: "Failed to fetch newsletters" }, { status: 500 })
  }
}

