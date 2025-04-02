import { NextResponse } from "next/server"

export async function GET() {
  try {
    const token = process.env.NEXT_PUBLIC_LITERAL_TOKEN

    if (!token) {
      return NextResponse.json({ error: "Literal API token not configured" }, { status: 500 })
    }

    // Fetch reading data from Literal API
    const response = await fetch("https://literal.club/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          {
            me {
              readingStates(status: READING) {
                book {
                  id
                  title
                  cover
                  authors {
                    name
                  }
                }
                startedAt
              }
            }
          }
        `,
      }),
    })

    if (!response.ok) {
      throw new Error(`Literal API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Check if we have reading data
    if (!data.data?.me?.readingStates || data.data.me.readingStates.length === 0) {
      return NextResponse.json({ error: "No books currently being read" }, { status: 404 })
    }

    // Get the first book being read (most recent)
    const currentReading = data.data.me.readingStates[0]

    // Format the response
    const currentBook = {
      id: currentReading.book.id,
      title: currentReading.book.title,
      author: currentReading.book.authors[0]?.name || "Unknown Author",
      coverImage: currentReading.book.cover,
      dateStarted: currentReading.startedAt,
      status: "READING",
    }

    return NextResponse.json(currentBook)
  } catch (error) {
    console.error("Error fetching current book:", error)
    return NextResponse.json({ error: "Failed to fetch current book" }, { status: 500 })
  }
}

