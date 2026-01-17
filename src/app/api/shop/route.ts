/**
 * ============================================================================
 * Shop API Route
 * ============================================================================
 * Author: Kris Yotam
 * Description: API endpoint for fetching shop items from system.db
 * Created: 2026-01-05
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { getAllShopItems } from "@/lib/system-db";

// ============================================================================
// GET Handler
// ============================================================================

export async function GET() {
  try {
    const items = getAllShopItems();

    // Transform to match expected format for backwards compatibility
    const transformedItems = items.map((item) => ({
      name: item.name,
      slug: item.slug,
      category: item.category,
      price: item.price,
      currency: item.currency,
      payment_url: item.paymentUrl,
      image: item.image,
      description: item.description,
      date: item.date,
      status: item.status,
      importance: item.importance,
      state: item.state,
      "aspect-ratio": item.aspectRatio,
    }));

    return NextResponse.json(transformedItems);
  } catch (error) {
    console.error("Error reading shop data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
