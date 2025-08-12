// app/api/newsletters/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import newsletters from "@/data/newsletters.json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.toLowerCase() || "";
    const year = searchParams.get("year") || "";

    let results = [...newsletters];
    if (query) {
      results = results.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.description.toLowerCase().includes(query) ||
        n.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    if (year && year !== "all") {
      results = results.filter(n => n.year === year);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    return NextResponse.json({ error: "Failed to fetch newsletters" }, { status: 500 });
  }
}

