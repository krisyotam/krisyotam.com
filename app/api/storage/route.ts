/**
 * ============================================================================
 * Storage API Route
 * Author: Kris Yotam
 * Date: 2026-01-04
 * Filename: route.ts
 * Description: API endpoint for fetching object storage bucket data from
 *              storage.db. Supports querying by bucket name.
 * ============================================================================
 */

import { NextRequest, NextResponse } from "next/server";
import { getBucketData, getAllBucketsData, getStorageStats } from "@/lib/storage-db";

// ============================================================================
// GET HANDLER
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bucket = searchParams.get("bucket");
    const stats = searchParams.get("stats");

    // Return stats if requested
    if (stats === "true") {
      const storageStats = getStorageStats();
      return NextResponse.json(storageStats);
    }

    // Return specific bucket data if bucket name provided
    if (bucket) {
      const data = getBucketData(bucket);
      return NextResponse.json(data);
    }

    // Return all buckets data by default
    const data = getAllBucketsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching storage data:", error);
    return NextResponse.json(
      { error: "Failed to fetch storage data" },
      { status: 500 }
    );
  }
}
