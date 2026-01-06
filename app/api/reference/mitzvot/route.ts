/**
 * ============================================================================
 * Mitzvot (613 Commandments) API Route
 * Author: Kris Yotam
 * Description: API endpoint for fetching Mitzvot from reference.db
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getAllMitzvot, searchMitzvot, getMitzvah } from "@/lib/reference-db";

// ============================================================================
// GET HANDLER
// ============================================================================

/**
 * GET /api/reference/mitzvot
 * Returns all mitzvot or searches/filters by query parameters
 *
 * Query Parameters:
 *   - q: Optional search query to filter by law text or scripture
 *   - id: Optional specific mitzvah ID to retrieve
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const id = searchParams.get("id");

    // If specific ID requested
    if (id) {
      const idNum = parseInt(id, 10);
      if (isNaN(idNum)) {
        return NextResponse.json(
          { error: "Invalid ID parameter" },
          { status: 400 }
        );
      }
      const mitzvah = getMitzvah(idNum);
      if (!mitzvah) {
        return NextResponse.json(
          { error: "Mitzvah not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(mitzvah);
    }

    // If search query provided, filter results
    if (query && query.trim()) {
      const mitzvot = searchMitzvot(query.trim());
      return NextResponse.json(mitzvot);
    }

    // Otherwise return all mitzvot
    const mitzvot = getAllMitzvot();
    return NextResponse.json(mitzvot);
  } catch (error: any) {
    console.error("Error fetching mitzvot:", error);
    return NextResponse.json(
      { error: "Failed to fetch mitzvot", details: error.message },
      { status: 500 }
    );
  }
}
