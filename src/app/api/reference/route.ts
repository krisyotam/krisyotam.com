/**
 * ============================================================================
 * Unified Reference API Route
 * ============================================================================
 * Author: Kris Yotam
 * Date: 2026-01-24
 *
 * Consolidates all reference-related endpoints into a single route.
 *
 * Usage:
 *   GET /api/reference?type=cpi                    → All CPI data
 *   GET /api/reference?type=cpi&format=map         → CPI as year->value map
 *   GET /api/reference?type=cpi&year=2020          → Specific year CPI
 *   GET /api/reference?type=cpi&amount=100&from=1990&to=2025 → Inflation calc
 *   GET /api/reference?type=dictionary&word=hello  → Dictionary lookup
 *   GET /api/reference?type=dictionary&q=hel&source=oed → Dictionary search
 *   GET /api/reference?type=mitzvot                → All mitzvot
 *   GET /api/reference?type=mitzvot&q=sabbath      → Search mitzvot
 *   GET /api/reference?type=mitzvot&id=1           → Specific mitzvah
 *   GET /api/reference?type=rules                  → Rules of the Internet
 *   GET /api/reference?type=rules&q=anonymous      → Search rules
 *   GET /api/reference?type=quotes                 → All quotes
 *   GET /api/reference?type=quotes&random=true     → Random quote
 *   GET /api/reference?type=symbols                → All symbols
 *   GET /api/reference?type=wotd                   → Word of the day
 *   GET /api/reference?type=wotd&random=true       → Random word
 *
 * @type api
 * @path src/app/api/reference/route.ts
 * ============================================================================
 */

import { NextResponse } from "next/server";
import {
  getAllCPI,
  getCPI,
  getCPIMap,
  calculateInflationAdjusted,
  getDefinition,
  getOEDDefinition,
  getMerriamWebsterDefinition,
  searchOED,
  searchMerriamWebster,
  getAllMitzvot,
  searchMitzvot,
  getMitzvah,
  getAllInternetRules,
  searchInternetRules,
  getAllSymbols,
} from "@/lib/reference-db";
import {
  getAllQuotes,
  getRandomQuote,
  getAllExcerpts,
  getRandomExcerpt,
  getWordOfTheDay,
  getRandomWord,
} from "@/lib/system-db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { error: "Missing 'type' parameter. Valid types: cpi, dictionary, mitzvot, rules, quotes, excerpts, symbols, wotd" },
        { status: 400 }
      );
    }

    switch (type) {
      // ========================================================================
      // CPI - Consumer Price Index
      // ========================================================================
      case "cpi": {
        const year = searchParams.get("year");
        const amount = searchParams.get("amount");
        const fromYear = searchParams.get("from");
        const toYear = searchParams.get("to");
        const format = searchParams.get("format");

        // Calculate inflation adjustment
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
        return NextResponse.json(getAllCPI());
      }

      // ========================================================================
      // Dictionary
      // ========================================================================
      case "dictionary": {
        const word = searchParams.get("word");
        const query = searchParams.get("q");
        const source = searchParams.get("source") || "both";
        const limit = parseInt(searchParams.get("limit") || "20", 10);

        // Exact word lookup
        if (word) {
          let result = null;
          switch (source) {
            case "oed":
              result = getOEDDefinition(word);
              break;
            case "merriam":
              result = getMerriamWebsterDefinition(word);
              break;
            default:
              result = getDefinition(word);
          }

          if (!result) {
            return NextResponse.json(
              { error: "Word not found", word },
              { status: 404 }
            );
          }
          return NextResponse.json(result);
        }

        // Search for partial matches
        if (query) {
          let results: any[] = [];
          switch (source) {
            case "oed":
              results = searchOED(query, limit);
              break;
            case "merriam":
              results = searchMerriamWebster(query, limit);
              break;
            default:
              const oedResults = searchOED(query, Math.ceil(limit / 2));
              const merriamResults = searchMerriamWebster(query, Math.ceil(limit / 2));
              results = [
                ...oedResults.map((r) => ({ ...r, source: "oed" })),
                ...merriamResults.map((r) => ({ ...r, source: "merriam" })),
              ];
          }
          return NextResponse.json(results);
        }

        return NextResponse.json(
          { error: "Please provide 'word' or 'q' parameter" },
          { status: 400 }
        );
      }

      // ========================================================================
      // Mitzvot (613 Commandments)
      // ========================================================================
      case "mitzvot": {
        const query = searchParams.get("q");
        const id = searchParams.get("id");

        if (id) {
          const idNum = parseInt(id, 10);
          if (isNaN(idNum)) {
            return NextResponse.json(
              { error: "Invalid ID parameter" },
              { status: 400 }
            );
          }
          const mitzvah = getMitzvah(idNum);
          if (!mitzvah) {
            return NextResponse.json(
              { error: "Mitzvah not found" },
              { status: 404 }
            );
          }
          return NextResponse.json(mitzvah);
        }

        if (query && query.trim()) {
          return NextResponse.json(searchMitzvot(query.trim()));
        }

        return NextResponse.json(getAllMitzvot());
      }

      // ========================================================================
      // Rules of the Internet
      // ========================================================================
      case "rules": {
        const query = searchParams.get("q");

        if (query && query.trim()) {
          return NextResponse.json(searchInternetRules(query.trim()));
        }

        return NextResponse.json(getAllInternetRules());
      }

      // ========================================================================
      // Quotes
      // ========================================================================
      case "quotes": {
        const random = searchParams.get("random") === "true";

        if (random) {
          const quote = getRandomQuote();
          if (!quote) {
            return NextResponse.json(
              { error: "No quotes available" },
              { status: 404, headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
            );
          }
          return NextResponse.json(quote, {
            headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
          });
        }

        return NextResponse.json({ quotes: getAllQuotes() });
      }

      // ========================================================================
      // Excerpts
      // ========================================================================
      case "excerpts": {
        const random = searchParams.get("random") === "true";

        if (random) {
          const excerpt = getRandomExcerpt();
          if (!excerpt) {
            return NextResponse.json(
              { error: "No excerpts available" },
              { status: 404, headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
            );
          }
          return NextResponse.json(excerpt, {
            headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
          });
        }

        return NextResponse.json({ excerpts: getAllExcerpts() });
      }

      // ========================================================================
      // Symbols
      // ========================================================================
      case "symbols": {
        return NextResponse.json({ symbols: getAllSymbols() });
      }

      // ========================================================================
      // Word of the Day
      // ========================================================================
      case "wotd": {
        const random = searchParams.get("random") === "true";
        const word = random ? getRandomWord() : getWordOfTheDay();

        if (!word) {
          return NextResponse.json(
            { error: "No words available" },
            { status: 404 }
          );
        }

        return NextResponse.json(word);
      }

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}. Valid types: cpi, dictionary, mitzvot, rules, quotes, symbols, wotd` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error in reference API:", error);
    return NextResponse.json(
      { error: "Failed to fetch reference data", details: error.message },
      { status: 500 }
    );
  }
}
