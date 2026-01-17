/**
 * =============================================================================
 * Papers API Route
 * =============================================================================
 *
 * Returns active papers from content.db.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { NextResponse } from "next/server";
import { getActiveContentByType } from "@/lib/data";

export async function GET() {
  try {
    const papers = getActiveContentByType('papers');
    return NextResponse.json(papers);
  } catch (error) {
    console.error("Error loading papers:", error);
    return NextResponse.json({ error: "Failed to load papers" }, { status: 500 });
  }
}
