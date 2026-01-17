/**
 * ============================================================================
 * Inflation Calculator Component
 * Author: Kris Yotam
 * Description: Client component for displaying inflation-adjusted USD values.
 *              Fetches CPI data from reference.db via API route.
 * ============================================================================
 */

"use client";

import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CPIData {
  [key: string]: number;
}

interface InflationProps {
  type: "USD" | "BTC";
  children: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract amount and year from text like "$13 in 2025"
 */
function parseInflationText(
  text: string
): { amount: number; year: number } | null {
  const match = text.match(/([$]?[\d,.]+)\s*(?:BTC|\$)?\s*in\s*(\d{4})/i);
  if (!match) return null;

  const amount = parseFloat(match[1].replace(/[^\d.]/g, ""));
  const year = parseInt(match[2], 10);

  return { amount, year };
}

/**
 * Format number with commas and 2 decimal places
 */
function formatNumber(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Calculate inflation-adjusted USD value
 */
function calculateUsdAdjustment(
  amount: number,
  year: number,
  cpiData: CPIData
): string {
  const cpiStart = cpiData[year.toString()];
  const cpiNow = cpiData["2025"];

  if (!cpiStart || !cpiNow) {
    return "(year out of range)";
  }

  const adjusted = amount * (cpiNow / cpiStart);
  return `(~$${formatNumber(adjusted)} today)`;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Inflation({ type, children }: InflationProps) {
  // ---------------------------------------------------------------------------
  // State Management
  // ---------------------------------------------------------------------------
  const [cpiData, setCpiData] = useState<CPIData | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // Data Fetching
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function fetchCPI() {
      try {
        const response = await fetch("/api/reference/cpi?format=map");
        if (!response.ok) throw new Error("Failed to fetch CPI data");
        const data = await response.json();
        setCpiData(data);
      } catch (error) {
        console.error("Error fetching CPI data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCPI();
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  // Validate input
  if (typeof children !== "string") {
    return <span>{children} (invalid format)</span>;
  }

  const parsed = parseInflationText(children);
  if (!parsed) {
    return <span>{children} (invalid format)</span>;
  }

  // Show loading state
  if (loading || !cpiData) {
    return (
      <span className="group relative inline-flex cursor-help">
        {children}{" "}
        <span className="text-gray-500">(loading...)</span>
      </span>
    );
  }

  // Calculate adjustment
  let adjustedText = "";
  if (type === "USD") {
    adjustedText = calculateUsdAdjustment(parsed.amount, parsed.year, cpiData);
  } else {
    // For BTC we'd need to fetch current rates
    adjustedText = "(BTC calculation requires server component)";
  }

  return (
    <span className="group relative inline-flex cursor-help">
      {children}{" "}
      <span
        className="text-gray-500 group-hover:underline"
        data-tooltip-id="inflation-tooltip"
      >
        {adjustedText}
      </span>
      <Tooltip
        id="inflation-tooltip"
        place="top"
        content="Adjusted using U.S. Bureau of Labor Statistics CPI (1913-2025) and CoinGecko (for BTC)"
      />
    </span>
  );
}
