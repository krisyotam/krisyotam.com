/**
 * ============================================================================
 * Videos API Route
 * ============================================================================
 * Author: Kris Yotam
 * Date: 2026-02-09
 *
 * Returns videos from the media.db database.
 *
 * Usage:
 *   GET /api/videos              → All active videos
 *   GET /api/videos?slug=xyz     → Single video by slug
 *   GET /api/videos?category=xyz → Videos by category
 *
 * @type api
 * @path src/app/api/videos/route.ts
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getVideos, getVideoBySlug, getVideosByCategory } from "@/lib/media-db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");

    // Single video by slug
    if (slug) {
      const video = getVideoBySlug(slug);
      if (!video) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 });
      }
      return NextResponse.json(video);
    }

    // Videos by category
    if (category) {
      const videos = getVideosByCategory(category);
      return NextResponse.json(videos);
    }

    // All videos
    const videos = getVideos();
    return NextResponse.json(videos);
  } catch (error: any) {
    console.error("Error in videos API:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos", details: error.message },
      { status: 500 }
    );
  }
}
