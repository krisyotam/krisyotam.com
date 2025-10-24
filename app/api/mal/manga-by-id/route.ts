// app/api/mal/manga-by-id/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getMangaById } from "@/lib/mal-api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    if (!idParam) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
    }

    const id = Number.parseInt(idParam, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID parameter" }, { status: 400 });
    }

    const data = await getMangaById(id);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching manga by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch manga", details: error.message },
      { status: 500 }
    );
  }
}
