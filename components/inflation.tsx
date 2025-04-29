"use client";

import React, { useEffect, useState } from "react";
import cpiData from "@/data/cpi.json"; // Make sure to put your CPI JSON here!
import { Tooltip } from "react-tooltip"; // Optional: if you want a nicer tooltip lib

interface InflationProps {
  type: "USD" | "BTC";
  children: string;
}

export default function Inflation({ type, children }: InflationProps) {
  const [adjustedText, setAdjustedText] = useState<string>("");

  useEffect(() => {
    const match = children.match(/([$]?[\d,.]+)\s*(?:BTC|\$)?\s*in\s*(\d{4})/i);
    if (!match) {
      setAdjustedText("(invalid format)");
      return;
    }

    let amount = parseFloat(match[1].replace(/[^\d.]/g, ""));
    const year = parseInt(match[2], 10);

    if (type === "USD") {
      adjustUSD(amount, year);
    } else if (type === "BTC") {
      adjustBTC(amount, year);
    }
  }, [children, type]);

  function adjustUSD(amount: number, year: number) {
    const cpiStart = cpiData[year];
    const cpiNow = cpiData[2025];

    if (!cpiStart || !cpiNow) {
      setAdjustedText("(year out of range)");
      return;
    }

    const adjusted = amount * (cpiNow / cpiStart);
    setAdjustedText(`(~$${formatNumber(adjusted)} today)`);
  }

  async function adjustBTC(amount: number, year: number) {
    try {
      const dateStr = `30-12-${year}`; // December 30 of the year
      const historicalRes = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${dateStr}`);

      if (!historicalRes.ok) throw new Error("Failed to fetch historical BTC data");

      const historicalData = await historicalRes.json();
      const historicalPrice = historicalData.market_data?.current_price?.usd;

      if (!historicalPrice) {
        setAdjustedText("(historical BTC data unavailable)");
        return;
      }

      const currentRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`);

      if (!currentRes.ok) throw new Error("Failed to fetch current BTC price");

      const currentData = await currentRes.json();
      const currentPrice = currentData.bitcoin.usd;

      const valueThen = amount * historicalPrice;
      const valueNow = amount * currentPrice;

      setAdjustedText(`(~$${formatNumber(valueThen)} in ${year}; ~$${formatNumber(valueNow)} today)`);
    } catch (error) {
      console.error("BTC fetch error:", error);
      setAdjustedText("(error fetching BTC)");
    }
  }

  function formatNumber(value: number): string {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
