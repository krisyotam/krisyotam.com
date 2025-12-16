import { NextResponse } from "next/server"
import contentData from "@/data/changelog/content.json"
import infraData from "@/data/changelog/infra.json"

type Entry = {
  id: string
  date: { day: string; weekday: string; month: string; year: string }
  text: string
  kind?: string
}

function normalize(text: string) {
  return (text || "").toLowerCase()
}

function selectFeed(feed: string | null): Entry[] {
  if (feed === "infra") return infraData as Entry[]
  return contentData as Entry[]
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const feed = searchParams.get("feed")
  const q = searchParams.get("q")

  let items = selectFeed(feed)

  if (q && q.trim().length > 0) {
    const n = normalize(q)
    items = items.filter((e) => {
      const hay = [
        e.text,
        e.kind ?? "",
        e.id,
        e.date?.weekday ?? "",
        e.date?.month ?? "",
        e.date?.year ?? "",
      ]
        .join("\n")
        .toLowerCase()
      return hay.includes(n)
    })
  }

  // newest first (ids are ISO dates)
  items = [...items].sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0))

  return NextResponse.json({ feed: feed === "infra" ? "infra" : "content", count: items.length, items })
}

export const revalidate = 60
export const dynamic = "force-dynamic"
