// app/api/books/current/route.ts
import { NextResponse } from "next/server"

type ReadingState = {
  status: string
  startedAt: string
  book: {
    id: string
    title: string
    cover: string
    authors: { name: string }[]
  }
}

export async function GET() {
  const token = process.env.NEXT_PUBLIC_LITERAL_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: "Literal API token not configured" },
      { status: 500 }
    )
  }

  const graphql = JSON.stringify({
    query: `
      query {
        myReadingStates {
          status
          startedAt
          book {
            id
            title
            cover
            authors { name }
          }
        }
      }
    `,
  })

  const res = await fetch("https://literal.club/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: graphql,
  })

  if (!res.ok) {
    const text = await res.text()
    console.error("Literal API error:", text)
    return NextResponse.json(
      { error: `Literal API responded with status: ${res.status}` },
      { status: res.status }
    )
  }

  const { data } = await res.json()
  const reading: ReadingState[] = data?.myReadingStates ?? []

  // pick first READING
  const current = reading.find((r) => r.status === "READING")
  if (!current) {
    return NextResponse.json(
      { error: "No books currently being read" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    id: current.book.id,
    title: current.book.title,
    author: current.book.authors[0]?.name || "Unknown Author",
    coverImage: current.book.cover,
    dateStarted: current.startedAt,
    status: "READING",
  })
}
