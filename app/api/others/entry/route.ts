import { type NextRequest, NextResponse } from "next/server"
import othersData from "@/data/others.json"

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 })
  }
  
  try {
    // Use imported data directly
    const entry = othersData.find((e: any) => e.slug === slug)

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error("Error fetching others entry:", error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
