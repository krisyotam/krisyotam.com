import { NextResponse } from "next/server";
import { getAllQuotes } from "@/lib/system-db";

export async function GET() {
  try {
    const quotes = getAllQuotes();
    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}
