/**
 * =============================================================================
 * Progymnasmata API Route
 * =============================================================================
 *
 * Provides progymnasmata data from content.db.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { NextResponse } from "next/server";
import { getActiveContentByType } from "@/lib/data";

export async function GET() {
  try {
    const progymnasmata = getActiveContentByType('progymnasmata');
    return NextResponse.json(progymnasmata);
  } catch (error) {
    console.error("Error loading progymnasmata:", error);
    return NextResponse.json({ error: "Failed to load progymnasmata" }, { status: 500 });
  }
}
