/**
 * ============================================================================
 * Symbols API Route
 * ============================================================================
 * Author: Kris Yotam
 * Description: API endpoint for fetching symbols from reference.db
 * Created: 2026-01-05
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getAllSymbols } from "@/lib/reference-db";

export async function GET() {
  try {
    const symbols = getAllSymbols();
    return NextResponse.json({ symbols });
  } catch (error) {
    console.error("Error fetching symbols:", error);
    return NextResponse.json({ symbols: [] }, { status: 500 });
  }
}
