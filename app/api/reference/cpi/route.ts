/**
 * ============================================================================
 * Consumer Price Index (CPI) API Route
 * Author: Kris Yotam
 * Description: API endpoint for fetching CPI data and calculating inflation
 *              adjustments from reference.db
 * ============================================================================
 */

import { NextResponse } from "next/server";
import {
  getAllCPI,
  getCPI,
  getCPIMap,
  calculateInflationAdjusted,
} from "@/lib/reference-db";

// ============================================================================
// GET HANDLER
// ============================================================================

/**
 * GET /api/reference/cpi
 * Returns CPI data or calculates inflation adjustment
 *
 * Query Parameters:
 *   - year: Optional specific year to get CPI for
 *   - amount: Amount to adjust for inflation
 *   - from: Year the amount is from
 *   - to: Year to adjust to (defaults to 2025)
 *   - format: "map" to return as year->value object
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const amount = searchParams.get("amount");
    const fromYear = searchParams.get("from");
    const toYear = searchParams.get("to");
    const format = searchParams.get("format");

    // Calculate inflation adjustment if amount and from year provided
    if (amount && fromYear) {
      const amountNum = parseFloat(amount);
      const fromNum = parseInt(fromYear, 10);
      const toNum = toYear ? parseInt(toYear, 10) : 2025;

      if (isNaN(amountNum) || isNaN(fromNum) || isNaN(toNum)) {
        return NextResponse.json(
          { error: "Invalid numeric parameters" },
          { status: 400 }
        );
      }

      const adjusted = calculateInflationAdjusted(amountNum, fromNum, toNum);
      if (adjusted === null) {
        return NextResponse.json(
          { error: "Year out of range" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        original: amountNum,
        fromYear: fromNum,
        toYear: toNum,
        adjusted: Math.round(adjusted * 100) / 100,
      });
    }

    // Get specific year
    if (year) {
      const yearNum = parseInt(year, 10);
      if (isNaN(yearNum)) {
        return NextResponse.json(
          { error: "Invalid year parameter" },
          { status: 400 }
        );
      }
      const cpi = getCPI(yearNum);
      if (!cpi) {
        return NextResponse.json(
          { error: "Year not found in CPI data" },
          { status: 404 }
        );
      }
      return NextResponse.json(cpi);
    }

    // Return as map if requested
    if (format === "map") {
      const map = getCPIMap();
      return NextResponse.json(map);
    }

    // Return all CPI data
    const cpiData = getAllCPI();
    return NextResponse.json(cpiData);
  } catch (error: any) {
    console.error("Error fetching CPI data:", error);
    return NextResponse.json(
      { error: "Failed to fetch CPI data", details: error.message },
      { status: 500 }
    );
  }
}
