// app/api/books/route.ts
import { NextResponse } from "next/server"

type ReadingState = {
  status: string
  startedAt: string
  finishedAt?: string
  book: {
    id: string
    title: string
    cover: string
    authors: { name: string }[]
  }
}

type Book = {
  id: string
  title: string
  cover: string
  authors: { name: string }[]
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
          finishedAt
          book {
            id
            title
            cover
            authors { name }
          }
        }
        myBooks {
          id
          title
          cover
          authors { name }
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
  const readingStates: ReadingState[] = data?.myReadingStates ?? []
  const allBooks: Book[] = data?.myBooks ?? []

  const out: any[] = []

  // READING & FINISHED
  for (const s of readingStates) {
    out.push({
      id: s.book.id,
      title: s.book.title,
      author: s.book.authors[0]?.name || "Unknown Author",
      coverImage: s.book.cover,
      dateStarted: s.startedAt,
      ...(s.finishedAt && { dateFinished: s.finishedAt }),
      status: s.status, // "READING" or "FINISHED"
    })
  }

  // WANT_TO_READ = any book not in readingStates
  const seen = new Set(readingStates.map((s) => s.book.id))
  for (const b of allBooks) {
    if (!seen.has(b.id)) {
      out.push({
        id: b.id,
        title: b.title,
        author: b.authors[0]?.name || "Unknown Author",
        coverImage: b.cover,
        status: "WANT_TO_READ",
      })
    }
  }

  return NextResponse.json(out)
}
