"use client";

import React from "react";
import cpiData from "@/data/cpi.json";
import { Tooltip } from "react-tooltip";

interface CPIData {
  [key: string]: number
}

interface InflationProps {
  type: "USD" | "BTC";
  children: string;
}

// Extract amount and year from text like "$13 in 2025"
function parseInflationText(text: string): { amount: number; year: number } | null {
  const match = text.match(/([$]?[\d,.]+)\s*(?:BTC|\$)?\s*in\s*(\d{4})/i);
  if (!match) return null;
  
  const amount = parseFloat(match[1].replace(/[^\d.]/g, ""));
  const year = parseInt(match[2], 10);
  
  return { amount, year };
}

// Format number with commas and 2 decimal places
function formatNumber(value: number): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Calculate inflation-adjusted USD value
function calculateUsdAdjustment(amount: number, year: number): string {
  const yearStr = year.toString() as keyof typeof cpiData;
  const cpiStart = cpiData[yearStr];
  const cpiNow = cpiData[2025];

  if (!cpiStart || !cpiNow) {
    return "(year out of range)";
  }

  const adjusted = amount * (cpiNow / cpiStart);
  return `(~$${formatNumber(adjusted)} today)`;
}

export default function Inflation({ type, children }: InflationProps) {
  // For BTC calculations, we'd use a server component or API route
  // Here we just handle USD which is the most common case
  
  if (typeof children !== 'string') {
    return <span>{children} (invalid format)</span>;
  }
  
  const parsed = parseInflationText(children);
  if (!parsed) {
    return <span>{children} (invalid format)</span>;
  }
  
  let adjustedText = "";
  if (type === "USD") {
    adjustedText = calculateUsdAdjustment(parsed.amount, parsed.year);
  } else {
    // For BTC we'd need to fetch current rates, which we can't do here
    // Instead just show a placeholder
    adjustedText = "(BTC calculation requires server component)";
  }

  return (
    <span className="group relative inline-flex cursor-help">
      {children}{" "}
      <span className="text-gray-500 group-hover:underline" data-tooltip-id="inflation-tooltip">
        {adjustedText}
      </span>
      <Tooltip id="inflation-tooltip" place="top" content="Adjusted using U.S. Bureau of Labor Statistics CPI (1913–2025) and CoinGecko (for BTC)" />
    </span>
  );
}
