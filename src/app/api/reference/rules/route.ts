/**
 * ============================================================================
 * Rules of the Internet API Route
 * Author: Kris Yotam
 * Description: API endpoint for fetching Rules of the Internet from reference.db
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getAllInternetRules, searchInternetRules } from "@/lib/reference-db";

// ============================================================================
// GET HANDLER
// ============================================================================

/**
 * GET /api/reference/rules
 * Returns all rules or searches by query parameter
 *
 * Query Parameters:
 *   - q: Optional search query to filter rules
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    // If search query provided, filter results
    if (query && query.trim()) {
      const rules = searchInternetRules(query.trim());
      return NextResponse.json(rules);
    }

    // Otherwise return all rules
    const rules = getAllInternetRules();
    return NextResponse.json(rules);
  } catch (error: any) {
    console.error("Error fetching rules of the internet:", error);
    return NextResponse.json(
      { error: "Failed to fetch rules", details: error.message },
      { status: 500 }
    );
  }
}
