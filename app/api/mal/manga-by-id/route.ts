import { NextResponse } from "next/server"
import { getMangaById } from "@/lib/mal-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 })
    }

    const data = await getMangaById(Number.parseInt(id))
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching manga by ID:", error)
    return NextResponse.json({ error: "Failed to fetch manga" }, { status: 500 })
  }
}

