/**
 * ============================================================================
 * Blogroll API Route
 * ============================================================================
 * Author: Kris Yotam
 * Description: API endpoint for fetching blogroll entries from system.db
 * Created: 2026-01-04
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getAllBlogrollEntries } from "@/lib/system-db";

// ============================================================================
// GET Handler
// ============================================================================

export async function GET() {
  try {
    const blogs = getAllBlogrollEntries();
    return NextResponse.json({ blogs });
  } catch (err) {
    console.error("Error fetching blogroll:", err);
    return NextResponse.json({ blogs: [] }, { status: 500 });
  }
}
