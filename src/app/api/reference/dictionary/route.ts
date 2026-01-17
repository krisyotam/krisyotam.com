/**
 * ============================================================================
 * Dictionary API Route
 * Author: Kris Yotam
 * Description: API endpoint for fetching word definitions from OED and
 *              Merriam-Webster dictionaries in reference.db
 * ============================================================================
 */

import { NextResponse } from "next/server";
import {
  getDefinition,
  getOEDDefinition,
  getMerriamWebsterDefinition,
  searchOED,
  searchMerriamWebster,
} from "@/lib/reference-db";

// ============================================================================
// GET HANDLER
// ============================================================================

/**
 * GET /api/reference/dictionary
 * Returns word definitions from dictionaries
 *
 * Query Parameters:
 *   - word: Word to look up (exact match)
 *   - q: Search query for partial matches
 *   - source: "oed", "merriam", or "both" (default: "both")
 *   - limit: Maximum results for search (default: 20)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get("word");
    const query = searchParams.get("q");
    const source = searchParams.get("source") || "both";
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    // Exact word lookup
    if (word) {
      let result = null;

      switch (source) {
        case "oed":
          result = getOEDDefinition(word);
          break;
        case "merriam":
          result = getMerriamWebsterDefinition(word);
          break;
        default:
          result = getDefinition(word);
      }

      if (!result) {
        return NextResponse.json(
          { error: "Word not found", word },
          { status: 404 }
        );
      }

      return NextResponse.json(result);
    }

    // Search for partial matches
    if (query) {
      let results: any[] = [];

      switch (source) {
        case "oed":
          results = searchOED(query, limit);
          break;
        case "merriam":
          results = searchMerriamWebster(query, limit);
          break;
        default:
          // Search both and combine results
          const oedResults = searchOED(query, Math.ceil(limit / 2));
          const merriamResults = searchMerriamWebster(
            query,
            Math.ceil(limit / 2)
          );
          results = [
            ...oedResults.map((r) => ({ ...r, source: "oed" })),
            ...merriamResults.map((r) => ({ ...r, source: "merriam" })),
          ];
      }

      return NextResponse.json(results);
    }

    // No parameters provided
    return NextResponse.json(
      { error: "Please provide 'word' or 'q' parameter" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error fetching dictionary definition:", error);
    return NextResponse.json(
      { error: "Failed to fetch definition", details: error.message },
      { status: 500 }
    );
  }
}
