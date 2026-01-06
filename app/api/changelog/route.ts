/**
 * ============================================================================
 * Changelog API Route
 * ============================================================================
 * Author: Kris Yotam
 * Description: API endpoint for fetching changelog entries from system.db
 * Created: 2026-01-04
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getChangelogContent, getChangelogInfra, type ChangelogEntry } from "@/lib/system-db";

// ============================================================================
// Helper Functions
// ============================================================================

function normalize(text: string) {
  return (text || "").toLowerCase();
}

function selectFeed(feed: string | null): ChangelogEntry[] {
  if (feed === "infra") return getChangelogInfra();
  return getChangelogContent();
}

// ============================================================================
// GET Handler
// ============================================================================

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const feed = searchParams.get("feed");
  const q = searchParams.get("q");

  let items = selectFeed(feed);

  // Apply search filter if provided
  if (q && q.trim().length > 0) {
    const n = normalize(q);
    items = items.filter((e) => {
      const hay = [
        e.text,
        e.kind ?? "",
        e.id,
        e.date?.weekday ?? "",
        e.date?.month ?? "",
        e.date?.year ?? "",
      ]
        .join("\n")
        .toLowerCase();
      return hay.includes(n);
    });
  }

  // Sort newest first (ids are ISO dates)
  items = [...items].sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0));

  return NextResponse.json({
    feed: feed === "infra" ? "infra" : "content",
    count: items.length,
    items,
  });
}

export const revalidate = 60;
export const dynamic = "force-dynamic";
