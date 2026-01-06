/**
 * ============================================================================
 * Videos API Route
 * ============================================================================
 * Author: Kris Yotam
 * Description: API endpoint for fetching videos from content.db
 * Created: 2026-01-05
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getActiveVideos, getCategoryBySlug } from "@/lib/content-db";

export async function GET() {
  try {
    const videos = getActiveVideos();

    // Transform to match expected format with category title
    const transformedVideos = videos.map((video) => {
      const category = video.category_slug
        ? getCategoryBySlug(video.category_slug)
        : null;

      return {
        slug: video.slug,
        title: video.title,
        subtitle: video.subtitle || "",
        preview: video.preview || "",
        image: video.image || "",
        video: video.video || "",
        category: category?.title || video.category_slug || "",
        tags: video.tags?.map((t) => t.title) || [],
        date: video.date || "",
        status: video.status || "Finished",
        confidence: video.confidence || "likely",
        importance: video.importance || 5,
        state: video.state,
      };
    });

    return NextResponse.json(transformedVideos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json([], { status: 500 });
  }
}
