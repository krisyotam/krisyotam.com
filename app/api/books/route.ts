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
              finishedStates: readingStates(status: FINISHED) {
                book {
                  id
                  title
                  cover
                  authors {
                    name
                  }
                }
                startedAt
                finishedAt
              }
              toReadStates: readingStates(status: WANT_TO_READ) {
                book {
                  id
                  title
                  cover
                  authors {
                    name
                  }
                }
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

    // Format the books data
    const books: any[] = []

    // Add currently reading books
    if (data.data?.me?.readingStates && data.data.me.readingStates.length > 0) {
      data.data.me.readingStates.forEach((item: { book: { id: any; title: any; authors: { name: any }[]; cover: any }; startedAt: any }) => {
        books.push({
          id: item.book.id,
          title: item.book.title,
          author: item.book.authors[0]?.name || "Unknown Author",
          coverImage: item.book.cover,
          dateStarted: item.startedAt,
          status: "READING",
        })
      })
    }

    // Add finished books
    if (data.data?.me?.finishedStates && data.data.me.finishedStates.length > 0) {
      data.data.me.finishedStates.forEach((item: { book: { id: any; title: any; authors: { name: any }[]; cover: any }; startedAt: any; finishedAt: any }) => {
        books.push({
          id: item.book.id,
          title: item.book.title,
          author: item.book.authors[0]?.name || "Unknown Author",
          coverImage: item.book.cover,
          dateStarted: item.startedAt,
          dateFinished: item.finishedAt,
          status: "FINISHED",
        })
      })
    }

    // Add to-read books
    if (data.data?.me?.toReadStates && data.data.me.toReadStates.length > 0) {
      data.data.me.toReadStates.forEach((item: { book: { id: any; title: any; authors: { name: any }[]; cover: any } }) => {
        books.push({
          id: item.book.id,
          title: item.book.title,
          author: item.book.authors[0]?.name || "Unknown Author",
          coverImage: item.book.cover,
          status: "WANT_TO_READ",
        })
      })
    }

    return NextResponse.json(books)
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}

