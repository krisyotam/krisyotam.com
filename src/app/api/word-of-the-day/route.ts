/**
 * ============================================================================
 * Word of the Day API Route
 * ============================================================================
 * Author: Kris Yotam
 * Description: API endpoint for fetching word of the day from system.db
 * Created: 2026-01-04
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getWordOfTheDay, getRandomWord } from "@/lib/system-db";

// ============================================================================
// GET Handler
// ============================================================================

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const random = searchParams.get("random");

  try {
    // If random parameter is set, get a truly random word
    // Otherwise, get the deterministic "word of the day"
    const word = random === "true" ? getRandomWord() : getWordOfTheDay();

    if (!word) {
      return NextResponse.json(
        { error: "No words available" },
        { status: 404 }
      );
    }

    return NextResponse.json(word);
  } catch (err) {
    console.error("Error fetching word of the day:", err);
    return NextResponse.json(
      { error: "Failed to fetch word" },
      { status: 500 }
    );
  }
}
